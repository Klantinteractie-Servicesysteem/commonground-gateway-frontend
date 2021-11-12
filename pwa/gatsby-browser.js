import React, {useEffect} from "react";
import "@utrecht/design-tokens/dist/theme/index.css";
import Layout from "./src/components/common/layout";
import {UrlContextWrapper} from "./src/context/urlContext";
import {Helmet} from "react-helmet";

export const wrapRootElement = ({ element }) => (
    <UrlContextWrapper>
        {element}
      <Helmet>
        <script src="https://unpkg.com/@nl-design-system-unstable/theme-switcher" />
      </Helmet>
    </UrlContextWrapper>
)
