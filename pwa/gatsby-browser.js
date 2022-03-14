import React from "react";
import "@utrecht/design-tokens/dist/theme/index.css";
import { UrlContextWrapper } from "./src/context/urlContext";
import { UserContextWrapper } from "./src/context/userContext";
import "./src/styles/main.css";
import { isLoggedIn, logout, validateSession } from "./src/services/auth";

export const onRouteUpdate = () => {
  if (!isLoggedIn()) {
    return;
  }

  if (!validateSession) {
    logout();
  }
};

export const wrapRootElement = ({ element }) => (
  <UserContextWrapper>
    <UrlContextWrapper>{element}</UrlContextWrapper>
  </UserContextWrapper>
);
