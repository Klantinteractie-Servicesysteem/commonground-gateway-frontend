import * as React from "react"
import { useEffect, useState } from "react";
import Layout from "../../components/common/layout";
import { useUrlContext } from "../../context/urlContext";
import Table from "../../components/common/table";

const IndexPage = () => {
  const context = useUrlContext();

  const [showSpinner, setShowSpinner] = useState(false);
  const [entities, setEntities] = useState(null);

  const getEntities = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + "/entities", {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setShowSpinner(false);
          setEntities(null);
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        setEntities(data['hydra:member']);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setEntities(null);
        setShowSpinner(false);
      });
  }

  useEffect(() => {
    getEntities();
  }, []);


  return (
    <Layout title={"Entities"} subtext={"An overview of your entity objects"}>
      <title>Gateway - Entities</title>
      <main>
        <div className="row">
          <div className="col-12">
            <Table title="Entities" helpLink={true} refresh={getEntities} addNewLink="/entities/new" editLink="/entities"
              thead={[{ thead: "Name", value: "name" }, { thead: "Endpoint", value: "endpoint" }, { thead: "Route", value: "route" }]} items={entities} showSpinner={showSpinner} />
          </div>
        </div>
      </main>
    </Layout>

  )
}
export default IndexPage
