import * as React from "react";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { CollectionForm } from "../../components/collections/collectionForm";

export const IndexPage = (props) => {
  const collectionId: string = props.params.collectionId === "new" ? null : props.params.collectionId;
  const activeTab: string = props.location.state.activeTab;
  const API: APIService = React.useContext(APIContext);

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
