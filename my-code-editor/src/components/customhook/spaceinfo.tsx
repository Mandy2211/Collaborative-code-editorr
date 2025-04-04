import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface ChangeContextType {
  change: boolean;
  setChange: (value: boolean) => void;
  currCodeSpaceName: string;
  setCurrCodeSpaceName: (name: string) => void;
  currCodeSpaceId: string;
  setCurrCodeSpaceId: (id: string) => void;
  currspacefolder: string[];
  setCurrspacefolder: (folders: string[]) => void;
}

// Create the context with a default value
const ChangeContext = createContext<ChangeContextType | undefined>(undefined);

// Provider component
export function ChangeProvider({ children }: { children: ReactNode }) {
  const [change, setChange] = useState(true);
  const [currCodeSpaceName, setCurrCodeSpaceName] = useState<string>("");
  const [currCodeSpaceId, setCurrCodeSpaceId] = useState<string>("");
  const [currspacefolder, setCurrspacefolder] = useState<string[]>([]);

  return (
    <ChangeContext.Provider
      value={{
        change,
        setChange,
        currCodeSpaceName,
        setCurrCodeSpaceName,
        currCodeSpaceId,
        setCurrCodeSpaceId,
        currspacefolder,
        setCurrspacefolder,
      }}
    >
      {children}
    </ChangeContext.Provider>
  );
}

// Custom hook to use the context
export function useChange() {
  const context = useContext(ChangeContext);
  if (!context) {
    throw new Error("useChange must be used within a ChangeProvider");
  }
  return context;
}
