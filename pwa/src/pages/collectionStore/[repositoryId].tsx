import * as React from "react";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import GeneralDetails from "../../components/collectionStore/generalDetails";
import { OrganizationDetails } from "../../components/collectionStore/organizationDetails";

const IndexPage = (props) => {
  const repositoryId: string = props.params.repositoryId;
  const activeTab: string = props.location.state.activeTab;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            {repositoryId && (
              <Tabs
                tabs={[
                  {
                    name: "Overview",
                    id: "overview",
                    active: activeTab !== "organization",
                  },
                  {
                    name: "Organization",
                    id: "organization",
                    active: activeTab === "organization",
                  },
                ]}
              />
            )}
          </div>
          <div className="tab-content">
            <div
              className={`tab-pane active`}
              id="overview"
              role="tabpanel"
              aria-labelledby="overview-tab"
            >
              <br />
              <GeneralDetails {...{ repositoryId }} />
            </div>
            <div
              className={`tab-pane`}
              id="organization"
              role="tabpanel"
              aria-labelledby="organization-tab"
            >
              <br />
              <OrganizationDetails {...{ repositoryId }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
