import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "gatsby";
import Layout from "../../components/common/layout";
import { useUrlContext } from "../../context/urlContext";
import Modal from "../../components/common/modal";
import CardHeader from "../../components/common/cardHeader";
import TableHeaders from "../../components/common/tableHeaders";
import TableCells from "../../components/common/tableCells";
import SourcesTable from "../../components/sources/sourcesTable";

const IndexPage = () => {
  const context = useUrlContext();
  const [sources, setSources] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const getSources = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + "/gateways", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (
          data["hydra:member"] !== undefined &&
          data["hydra:member"] !== null
        ) {
          setSources(data["hydra:member"]);
          setShowSpinner(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getSources();
  }, []);

  return (
    <Layout title={"Sources"} subtext={"An overview of your Source objects"}>
      <main>
        <a
          href={`${context.apiUrl}/export/gateways`}
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
