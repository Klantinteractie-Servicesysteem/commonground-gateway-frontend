import * as React from "react";
import Layout from "../../components/common/layout";
import { useUrlContext } from "../../context/urlContext";
import SourcesTable from "../../components/sources/sourcesTable";

const IndexPage = () => {
  const context = useUrlContext();

  return (
    <Layout title={"Sources"} subtext={"An overview of your Source objects"}>
      <title>Gateway - Sources</title>
      <main>
        <a
          href={`${context.adminUrl}/export/gateways`}
          target="_blank"
          className=""
        >
          <button className="utrecht-button mt-0 mb-4" type="button">
            Export Sources
          </button>
        </a>
        <div className="row">
          <div className="col-12">
            <SourcesTable />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
