import { useEditorState, type Editor as TiptapEditor } from "@tiptap/react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  TableIcon,
  InsertRowDownIcon,
  InsertColumnRightIcon,
  DeleteRowIcon,
  DeleteColumnIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

type TableAction = {
  label: string;
  icon: IconSvgElement;
  run: (editor: TiptapEditor) => boolean;
};

const tableActions: TableAction[] = [
  {
    label: "Add row",
    icon: InsertRowDownIcon,
    run: (editor) => editor.chain().focus().addRowAfter().run(),
  },
  {
    label: "Delete row",
    icon: DeleteRowIcon,
    run: (editor) => editor.chain().focus().deleteRow().run(),
  },
  {
    label: "Add column",
    icon: InsertColumnRightIcon,
    run: (editor) => editor.chain().focus().addColumnAfter().run(),
  },
  {
    label: "Delete column",
    icon: DeleteColumnIcon,
    run: (editor) => editor.chain().focus().deleteColumn().run(),
  },
  {
    label: "Delete table",
    icon: Delete02Icon,
    run: (editor) => editor.chain().focus().deleteTable().run(),
  },
];

export default function Tools({ editor }: { editor: TiptapEditor }) {
  const isInTable = useEditorState({
    editor,
    selector: ({ editor }) => editor.isActive("table"),
  });

  return (
    <ul className="flex flex-nowrap overflow-x-auto pb-4 gap-1 list-none m-0 [&>*]:h-11 [&>*]:w-11 [&>*]:shrink-0">
      {" "}
      <li className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="w-full h-full flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer"
        >
          <strong>B</strong>
        </button>
      </li>
      <li className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="w-full h-full flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer"
        >
          <i>I</i>
        </button>
      </li>
      <li className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="w-full h-full flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer"
        >
          <s>S</s>
        </button>
      </li>
      <li className="flex items-center">
        <button
          onClick={() =>
            (editor as TiptapEditor).chain().focus().toggleUnderline().run()
          }
          className="w-full h-full flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer"
        >
          <u>U</u>
        </button>
      </li>
      <li className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className="w-full h-full flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer"
        >
          {"</>"}
        </button>
      </li>
      <li className="flex flex-col items-center justify-center hover:bg-gray-100 rounded cursor-pointer">
        <label htmlFor="colorInput" className="cursor-pointer">
          A
        </label>
        <input
          id="colorInput"
          type="color"
          onClick={(e: React.MouseEvent<HTMLInputElement>) =>
            editor.commands.setColor((e.target as HTMLInputElement).value)
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            editor.commands.setColor(e.target.value)
          }
          className="w-6 h-2 mt-1"
        />
      </li>
      <li className="flex items-center border-l border-gray-200 h-5 !w-px" />
      <li className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="w-full h-full flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <circle cx="2" cy="3" r="1.5" />
            <rect x="5" y="2.25" width="9" height="1.5" rx="0.25" />

            <circle cx="2" cy="8" r="1.5" />
            <rect x="5" y="7.25" width="9" height="1.5" rx="0.25" />

            <circle cx="2" cy="13" r="1.5" />
            <rect x="5" y="12.25" width="9" height="1.5" rx="0.25" />
          </svg>
        </button>
      </li>
      <li className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="w-full h-full flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <text
              x="0"
              y="3.5"
              fontSize="6"
              fontFamily="Arial"
              fontWeight="bold"
              textAnchor="start"
              dominantBaseline="middle"
            >
              1
            </text>
            <rect x="6" y="2" width="10" height="1.5" rx="0.25" />

            <text
              x="0"
              y="8"
              fontSize="6"
              fontFamily="Arial"
              fontWeight="bold"
              textAnchor="start"
              dominantBaseline="middle"
            >
              2
            </text>
            <rect x="6" y="6.5" width="10" height="1.5" rx="0.25" />

            <text
              x="0"
              y="13.5"
              fontSize="6"
              fontFamily="Arial"
              fontWeight="bold"
              textAnchor="start"
              dominantBaseline="middle"
            >
              3
            </text>
            <rect x="6" y="12" width="10" height="1.5" rx="0.25" />
          </svg>
        </button>
      </li>
      <li className="flex items-center border-l border-gray-200 h-5 !w-px" />
      <li className="flex items-center">
        <button
          type="button"
          title="Insert table"
          aria-label="Insert table"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          className="w-full h-full flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer"
        >
          <HugeiconsIcon icon={TableIcon} size={18} />
        </button>
      </li>
      {tableActions.map(({ label, icon, run }) => (
        <li key={label} className="flex items-center">
          <button
            type="button"
            title={label}
            aria-label={label}
            disabled={!isInTable}
            onClick={() => run(editor)}
            className="w-full h-full flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <HugeiconsIcon icon={icon} size={18} />
          </button>
        </li>
      ))}
    </ul>
  );
}
