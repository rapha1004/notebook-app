import { createContext, useContext, useState, ReactNode } from "react";

type Note = {
  _id: string;
  title: string;
};

type NoteContextType = {
  NoteList: Note[];
  setNoteList: React.Dispatch<React.SetStateAction<Note[]>>;
};

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [NoteList, setNoteList] = useState<Note[]>([]);

  return (
    <NoteContext.Provider value={{ NoteList, setNoteList }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNote = () => {
  const context = useContext(NoteContext);

  if (!context) {
    throw new Error("useNote must be used inside NoteProvider");
  }

  return context;
};