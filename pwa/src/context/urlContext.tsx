import { createContext, useContext } from "react";
import * as React from "react";

const UrlContext = createContext(undefined);

export function UrlContextWrapper({ children }) {

  let sharedState = {};

  if (typeof window !== "undefined") {
    sharedState = {
      meUrl: (window as any).GATSBY_ME_URL ?? process.env.GATSBY_ME_URL,
      apiUrl: (window as any).GATSBY_API_URL ?? process.env.GATSBY_API_URL,
      baseUrl: (window as any).GATSBY_BASE_URL ?? process.env.GATSBY_BASE_URL,
      frontendUrl: (window as any).GATSBY_FRONTEND_URL ?? process.env.GATSBY_FRONTEND_URL,
      organization: (window as any).GATSBY_ORGANIZATION ?? process.env.GATSBY_ORGANIZATION,
      loginRedirect: (window as any).GATSBY_LOGIN_REDIRECT ?? process.env.GATSBY_LOGIN_REDIRECT
    };
  }

  return (
    <UrlContext.Provider value={sharedState}>
      {children}
    </UrlContext.Provider>
  );
}

export function useUrlContext() {
  return useContext(UrlContext);
}
