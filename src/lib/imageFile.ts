// Client-side image handling for the editor: resize and convert to a
// data URL so images live inside the note document (no file storage).
import type { Editor as TiptapEditor } from "@tiptap/react";

const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 0.85;

const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });

/**
 * Turn an image file into a data URL small enough to embed in a note.
 * - Raster images are downscaled to MAX_DIMENSION and re-encoded as WebP
 *   (keeps transparency; falls back to PNG on browsers without WebP encode).
 * - GIFs and SVGs pass through untouched (canvas would drop animation/vector).
 */
export async function processImageFile(file: File): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return dataUrl;
  }
  try {
    const img = await loadImage(dataUrl);
    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight),
    );
    if (scale >= 1 && file.type === "image/webp") {
      // Already small and already WebP: no re-encode needed.
      return dataUrl;
    }
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/webp", WEBP_QUALITY);
  } catch {
    // If decoding fails, fall back to the raw data URL.
    return dataUrl;
  }
}

/** Resize each file and insert the images into the editor, at `pos` when
 * given (drop position) or at the current selection otherwise. */
export async function insertImageFiles(
  editor: TiptapEditor,
  files: File[],
  pos?: number,
): Promise<void> {
  const nodes: { type: string; attrs: { src: string; alt: string } }[] = [];
  for (const file of files) {
    try {
      const src = await processImageFile(file);
      nodes.push({ type: "image", attrs: { src, alt: file.name } });
    } catch (error) {
      console.error("Could not insert image:", error);
    }
  }
  if (nodes.length === 0) return;
  const chain = editor.chain().focus();
  if (pos != null) {
    chain.insertContentAt(pos, nodes);
  } else {
    chain.insertContent(nodes);
  }
  chain.run();
}
