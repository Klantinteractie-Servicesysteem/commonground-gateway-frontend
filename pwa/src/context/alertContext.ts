import * as React from "react";

export interface AlertProps {
  message: string,
  type: "danger" | "success",
}

export const AlertContext = React.createContext<[AlertProps, (value: AlertProps) => void]>(null);
export const AlertProvider = AlertContext.Provider;
