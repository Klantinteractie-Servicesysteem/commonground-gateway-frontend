import React from "react";
import "@utrecht/design-tokens/dist/theme/index.css";
import { UrlContextWrapper } from "./src/context/urlContext";
import { UserContextWrapper } from "./src/context/userContext";
import "./src/styles/main.css";
import 'gatsby-plugin-breadcrumb/gatsby-plugin-breadcrumb.css'

export const wrapRootElement = ({ element }) => (
  <UserContextWrapper>
    <UrlContextWrapper>{element}</UrlContextWrapper>
  </UserContextWrapper>
);
