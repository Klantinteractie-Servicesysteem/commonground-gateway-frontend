import * as React from "react";

export const HeaderContext = React.createContext<[string | JSX.Element, (value: string | JSX.Element) => void]>(null);
export const HeaderProvider = HeaderContext.Provider;
