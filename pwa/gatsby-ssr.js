import React, {useEffect} from "react";
import "@utrecht/design-tokens/dist/theme/index.css";
import Layout from "./src/components/common/layout";
import {UrlContextWrapper} from "./src/context/urlContext";
import {Helmet} from "react-helmet";
import {UserContextWrapper} from "./src/context/userContext";
import "./src/styles/main.css"

export const wrapRootElement = ({ element }) => (
  <UserContextWrapper>
    <UrlContextWrapper>
      {element}
      <Helmet>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
              integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
              crossOrigin="anonymous" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
                crossOrigin="anonymous" />
        <script src="https://unpkg.com/@nl-design-system-unstable/theme-switcher" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
              integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ=="
              crossOrigin="anonymous" referrerpolicy="no-referrer"/>
      </Helmet>
    </UrlContextWrapper>
  </UserContextWrapper>
)
