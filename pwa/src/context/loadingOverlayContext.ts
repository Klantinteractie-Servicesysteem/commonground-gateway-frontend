import * as React from "react";

export interface LoadingOverlayProps {
  isLoading: boolean,
}

export const LoadingOverlayContext = React.createContext<[LoadingOverlayProps, (value: LoadingOverlayProps) => void]>(null);
export const LoadingOverlayProvider = LoadingOverlayContext.Provider;
