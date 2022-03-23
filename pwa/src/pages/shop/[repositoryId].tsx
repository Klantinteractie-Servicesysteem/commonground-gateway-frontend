import * as React from "react";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import ShopDetail from "../../components/shop/shopDetail";

const IndexPage = (props) => {
  const repositoryId: string = props.params.repositoryId;
  // const activeTab: string = props.location.state.activeTab;

  console.log(repositoryId)
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
                    // active: activeTab !== "organization",
                  },
                  {
                    name: "Organization",
                    id: "organization",
                    // active: activeTab === "organization",
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
              <ShopDetail {...{ repositoryId }} />
            </div>
            <div
              className={`tab-pane`}
              id="organization"
              role="tabpanel"
              aria-labelledby="organization-tab"
            >
              <br />
              {/*<HandlersTable {...{ repositoryId }} />*/}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
