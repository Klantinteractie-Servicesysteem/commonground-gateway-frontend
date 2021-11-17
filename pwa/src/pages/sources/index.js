import * as React from "react"
import { useEffect, useState } from "react";
import Layout from "../../components/common/layout";
import { useUrlContext } from "../../context/urlContext";
import Table from "../../components/common/table";

const IndexPage = () => {
  const context = useUrlContext();

  const [showSpinner, setShowSpinner] = useState(false);
  const [sources, setSources] = useState(null);

  const getSources = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + "/gateways", {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setShowSpinner(false);
          setSources(null);
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
          setSources(data['hydra:member']);
          setShowSpinner(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setSources(null);
        setShowSpinner(false);
      });
  }

  useEffect(() => {
    getSources();
  }, []);


  return (
    <Layout title={"Sources"} subtext={"An overview of your Source objects"}>
      <title>Gateway - Sources</title>
      <main>
        <div className="row">
          <div className="col-12">
            <Table title="Sources" helpLink={true} refresh={getSources} addNewLink="/sources/new" editLink="/sources"
              thead={[{ thead: "Name", value: "name" }, { thead: "Location", value: "location" }]} items={sources} showSpinner={showSpinner} />
          </div>
        </div>
      </main>
    </Layout>

      )
}
export default IndexPage
