import * as React from "react";
import Layout from "../../components/common/layout";
import AttributeTable from "../../components/attributes/attributeTable";
import LogsTable from "../../components/logs/logsTable";
import DataTable from "../../components/object_entities/dataTable";
import EntityForm from "../../components/entities/entityForm";
import {Tabs} from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import { isLoggedIn } from "../../services/auth";

const IndexPage = (props) => {
  const [title, setTitle] = React.useState("Loading..");
  const [context, setContext] = React.useState(null);
  const [entity, setEntities] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: window.GATSBY_API_URL,
      });
    } else {
      if (isLoggedIn()) {
        if (props.params.id == "new") {
          setTitle("New entity");
        } else {
          fetch(`${context.adminUrl}/entities/${props.params.id}`, {
            credentials: "include",
            headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("data")
              console.log(data)
              setTitle(`Entity: ${data.name}`);
              setEntities(data)
            });
        }
      }
    }
  }, [context]);

  return (
    <Layout title={title} subtext={"Add or modify your entity"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              {props.params.id !== "new" ? (
                  <Tabs items={[{ name: "Main", id: "main", active: true },
                    {
                      name: "Attributes",
                      id: "attributes",
                    },
                    { name: "Data", id: "data" },
                    { name: "Logs", id: "logs" },
                  ]}/>
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
