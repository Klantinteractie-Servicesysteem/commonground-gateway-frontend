import React from "react";
import "@utrecht/design-tokens/dist/theme/index.css";
import { UrlContextWrapper } from "./src/context/urlContext";
import { UserContextWrapper } from "./src/context/userContext";
import "./src/styles/main.css";
import "./src/styles/form.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { isLoggedIn, logout, validateSession } from "./src/services/auth";

export const onRouteUpdate = () => {
  if (!isLoggedIn()) {
    return;
  }

  if (!validateSession) {
    logout();
  }
};

export const wrapRootElement = ({ element }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <UserContextWrapper>
        <UrlContextWrapper>{element}</UrlContextWrapper>
      </UserContextWrapper>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
