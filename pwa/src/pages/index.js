import * as React from "react"
import Layout from "../components/common/layout";
import {useUrlContext} from "../context/urlContext";
import { UtrechtHeading1 } from "@utrecht/web-component-library-react";

const IndexPage = () => {
  const context = useUrlContext();

  return (
      <Layout title={"Dashboard"} subtext={"Welcome to the gateway admin dashboard"}>

      </Layout>
  )
}

export default IndexPage
