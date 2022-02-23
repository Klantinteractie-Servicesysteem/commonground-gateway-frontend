import * as React from "react";
import AttributeTable from "../../components/attributes/attributeTable";
import ObjectEntitiesTable from "../../components/objectEntities/ObjectEntitiesTable";
import EntityForm from "../../components/entities/entityForm";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import LogTable from "../../components/logs/logTable/logTable";

const IndexPage = (props) => {
  const entityId: string = props.params.entityId === "new" ? null : props.params.entityId;
  const activeTab: string = props.location.state.activeTab;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            {entityId && (
              <Tabs
                items={[
                  { name: "Overview", id: "overview", active: !activeTab },
                  { name: "Attributes", id: "attributes", active: activeTab === "attributes" },
                  { name: "Objects", id: "data", active: activeTab === "objects" },
                  { name: "Logs", id: "logs" },
                ]}
              />
            )}
          </div>
          <div className="tab-content">
            <div
              className={`tab-pane ${!activeTab && "active"}`}
              id="overview"
              role="tabpanel"
              aria-labelledby="overview-tab"
            >
              <br />
              <EntityForm {...{ entityId }} />
            </div>
            <div
              className={`tab-pane ${activeTab === "attributes" && "active"}`}
              id="attributes"
              role="tabpanel"
              aria-labelledby="attributes-tab"
            >
              <br />
              <AttributeTable {...{ entityId }} />
            </div>
            <div
              className={`tab-pane ${activeTab === "objects" && "active"}`}
              id="data"
              role="tabpanel"
              aria-labelledby="data-tab"
            >
              <br />
              <ObjectEntitiesTable {...{ entityId }} />
            </div>
            <div className="tab-pane" id="logs" role="tabpanel" aria-labelledby="logs-tab">
              <br />
              <LogTable {...{ entityId }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
