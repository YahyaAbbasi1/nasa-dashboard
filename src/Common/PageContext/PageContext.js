import React, { useReducer, createContext, useContext } from "react";
import reducer, { initialState } from "./reducer";

export const PageContext = createContext({});

export const PageContextProvider = ({ children }) => (
  <PageContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </PageContext.Provider>
);

export const usePageContext = () => useContext(PageContext);
