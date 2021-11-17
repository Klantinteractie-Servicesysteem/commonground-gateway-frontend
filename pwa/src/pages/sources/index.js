import * as React from "react"
import { useEffect, useState } from "react";
import { Link } from "gatsby"
import Layout from "../../components/common/layout";
import { useUrlContext } from "../../context/urlContext";
import Modal from "../../components/common/modal";
import Table from "../../components/common/table";

const IndexPage = () => {
  const context = useUrlContext();

  const pageDescription = "On this page u can view and create your gateways sources.";

  const [sources, setSources] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const getSources = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + "/gateways", {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then((data) => {
        if (data['hydra:member'] !== undefined && data['hydra:member'] !== null) {
          setSources(data['hydra:member']);
          setShowSpinner(false);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    getSources();
  }, []);


  return (
    <Layout title={"Sources"} subtext={"An overview of your Source objects"}>
      <main>
        <div className="row">
          <div className="col-12">
            <title>Gateway - Sources</title>
            <Table title="Sources" helpLink={true} refresh={getSources} addNewLink="/sources/new" editLink="/sources"
              thead={[{ thead: "Name", value: "name" }, { thead: "Location", value: "location" }]} items={sources} showSpinner={showSpinner} />
          </div>
        </div>
      </main>
    </Layout>

      )
}

      export default IndexPage
