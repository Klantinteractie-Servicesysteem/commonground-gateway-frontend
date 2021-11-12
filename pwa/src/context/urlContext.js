import React from "react";

const UrlContext = React.createContext(undefined);

export function UrlContextWrapper({ children }) {

  let sharedState = {};
  let meUrl;
  let apiUrl;
  let baseUrl;
  let frontendUrl;
  let organization;

  if (typeof window !== 'undefined') {
    if (window.location.href.includes('http://localhost')) {
      meUrl = 'http://localhost/me';
      apiUrl = 'http://localhost/api';
      baseUrl = 'http://localhost';
      frontendUrl = 'http://localhost:3000';
      organization = 'http://webresourcecatalogus.conduction.svc.cluster.local/organizations/b2d3176e-f1c6-4365-ab86-dd253c65fc43';
    } else {
      meUrl = 'https://verhuizen.accp.s-hertogenbosch.nl/api/users/me';
      apiUrl = 'https://verhuizen.accp.s-hertogenbosch.nl/api';
      baseUrl = 'https://verhuizen.accp.s-hertogenbosch.nl';
      frontendUrl = 'https://verhuizen.accp.s-hertogenbosch.nl';
      organization = 'http://webresourcecatalogus.verhuizen.svc.cluster.local/organizations/4f387d0e-a2e5-44c0-9902-c31b63a8ee36';
    }
  }

  sharedState = {
    meUrl: meUrl,
    apiUrl: apiUrl,
    baseUrl: baseUrl,
    frontendUrl: frontendUrl,
    organization: organization,
  }


  return (
    <UrlContext.Provider value={sharedState}>
      {children}
    </UrlContext.Provider>
  );
}

export function useUrlContext() {
  return React.useContext(UrlContext);
}
