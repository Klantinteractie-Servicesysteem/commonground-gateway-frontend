import * as React from "react";
import Layout from "../../components/common/layout";
import { useUrlContext } from "../../context/urlContext";
import Modal from "../../components/common/modal";
import CardHeader from "../../components/common/cardHeader";
import TableHeaders from "../../components/common/tableHeaders";
import TableCells from "../../components/common/tableCells";
import SourcesTable from "../../components/sources/sourcesTable";

const IndexPage = () => {
  const context = useUrlContext();

  return (
    <Layout title={"Sources"} subtext={"An overview of your Source objects"}>
      <title>Gateway - Sources</title>
      <main>
        <a href={`${context.apiUrl}/export/gateways`} target="_blank" className="">
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
