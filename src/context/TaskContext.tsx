import { createContext } from "react";

export const TaskContext = createContext();

//Componente grande que contiene a otros más pequeño

import { ReactNode } from "react";

export const TaskContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TaskContext.Provider value={{ name: "hello world" }}>
      {children}
    </TaskContext.Provider>
  );
};
