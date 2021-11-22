import * as React from "react";
import Layout from "../../components/common/layout";
import AttributeTable from "../../components/attributes/attributeTable";
import LogsTable from "../../components/entities/logsTable";
import DataTable from "../../components/object_entities/dataTable";
import EntityForm from "../../components/entities/entityForm";
import Tabs from "../../components/common/tabs";
import { useUrlContext } from "../../context/urlContext";

const IndexPage = (props) => {
  const [title, setTitle] = React.useState("Loading..");

  const context = useUrlContext();

  const handleTitle = () => {
    if (props.params.id == "new") {
      setTitle("New entity");
    } else {
      fetch(`${context.apiUrl}/entities/${props.params.id}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          setTitle(`Entity: ${data.name}`);
        });
    }
  };

  React.useEffect(() => {
    handleTitle();
  }, []);

  return (
    <Layout title={title} subtext={"Add or modify your entity"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              {props.params.id !== "new" ? (
                <Tabs
                  items={[
                    { name: "Main", id: "main", active: true },
                    {
                      name: "Attributes",
                      id: "attributes",
                    },
                    { name: "Data", id: "data" },
                    { name: "Logs", id: "logs" },
                  ]}
                />
              ) : (
                <Tabs items={[{ name: "Main", id: "main", active: true }]} />
              )}
            </div>
            <div className="tab-content">
              <div
                className="tab-pane active"
                id="main"
                role="tabpanel"
                aria-labelledby="main-tab"
              >
                <br />
                <EntityForm id={props.params.id} />
              </div>
              <div
                className="tab-pane"
                id="attributes"
                role="tabpanel"
                aria-labelledby="attributes-tab"
              >
                <br />
                <AttributeTable id={props.params.id} />
              </div>
              <div
                className="tab-pane"
                id="data"
                role="tabpanel"
                aria-labelledby="data-tab"
              >
                <br />
                <DataTable id={props.params.id} />
              </div>
              <div
                className="tab-pane"
                id="logs"
                role="tabpanel"
                aria-labelledby="data-tab"
              >
                <br />
                <LogsTable id={props.params.id} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
