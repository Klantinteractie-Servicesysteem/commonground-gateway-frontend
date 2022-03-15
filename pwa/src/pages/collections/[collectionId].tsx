import * as React from "react";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import EndpointForm from "../../components/endpoints/endpointForm";
import HandlersTable from "../../components/handlers/handlerTable";
import LogTable from "../../components/logs/logTable/logTable";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { Card, Modal } from "@conductionnl/nl-design-system/lib";
import { AlertContext } from "../../context/alertContext";
import Spinner from "../../components/common/spinner";
import CollectionTable from "../../components/collections/collectionTable";
import { CollectionForm } from "../../components/collections/collectionForm";
import AttributeTable from "../../components/attributes/attributeTable";
import { ApplicationsTable } from "../../components/applications/applicationsTable";
import { EndpointsTable } from "../../components/endpoints/endpointsTable";
import { EntitiesTable } from "../../components/entities/entitiesTable";

export const IndexPage = (props) => {
  const collectionId: string = props.params.collectionId === "new" ? null : props.params.collectionId;
  const activeTab: string = props.location.state.activeTab;
  const API: APIService = React.useContext(APIContext);
  const [showSpinner, setShowSpinner] = React.useState(false);

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            {collectionId && (
              <Tabs
                tabs={[
                  {
                    name: "Overview",
                    id: "overview",
                    active: !activeTab,
                  },
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
              <CollectionForm {...{ collectionId }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
