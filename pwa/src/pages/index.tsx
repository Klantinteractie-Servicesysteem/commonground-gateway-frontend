import * as React from "react";
import Layout from "../components/common/layout";
import { useUrlContext } from "../context/urlContext";

const IndexPage = () => {
  const context = useUrlContext();

  return (
    <Layout
      title={"Dashboard"}
      subtext={"Welcome to the gateway admin dashboard"}
    >
      <a href={`${context.apiUrl}/export/all`} target="_blank">
        <button className="utrecht-button" type="button">
          Export Configuration
        </button>
      </a>
    </Layout>
  );
};

export default IndexPage;
