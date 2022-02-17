import * as React from "react";
import Layout from "../../components/common/layout";
import AttributeTable from "../../components/attributes/attributeTable";
import ObjectEntitiesTable from "../../components/objectEntities/ObjectEntitiesTable";
import EntityForm from "../../components/entities/entityForm";
import {Tabs} from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import LogTable from "../../components/logs/logTable/logTable";

const IndexPage = (props) => {
  const entityId: string = props.params.id === "new" ? null : props.params.id;

  return (
    <Layout title={"Object types"} subtext={"Create or modify your object types"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              {props.params.id !== "new" ? (
                <Tabs
                  items={[
                    {name: "Overview", id: "overview", active: true},
                    {
                      name: "Attributes",
                      id: "attributes",
                    },
                    {name: "Objects", id: "data"},
                    {name: "Logs", id: "logs"}
                  ]}
                />
              ) : (
                <Tabs
                  items={[{name: "Overview", id: "overview", active: true}]}
                />
              )}
            </div>
            <div className="tab-content">
              <div
                className="tab-pane active"
                id="overview"
                role="tabpanel"
                aria-labelledby="overview-tab"
              >
                <br/>
                <EntityForm {...{entityId}}/>
              </div>
              <div
                className="tab-pane"
                id="attributes"
                role="tabpanel"
                aria-labelledby="attributes-tab"
              >
                <br/>
                <AttributeTable {...{entityId}}/>
              </div>
              <div
                className="tab-pane"
                id="data"
                role="tabpanel"
                aria-labelledby="data-tab"
              >
                <br/>
                <ObjectEntitiesTable {...{entityId}}/>
              </div>
              <div
                className="tab-pane"
                id="logs"
                role="tabpanel"
                aria-labelledby="logs-tab"
              >
                <br/>
                <LogTable entityId={entityId}/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
