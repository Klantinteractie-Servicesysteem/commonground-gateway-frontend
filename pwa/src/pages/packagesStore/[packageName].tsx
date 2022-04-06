import * as React from "react";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import GeneralDetails from "../../components/packagesStore/generalDetails";

const IndexPage = (props) => {
  const packageName: string = props.params.packageName;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            {packageName && (
              <Tabs
                tabs={[
                  {
                    name: "Overview",
                    id: "overview",
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
              <GeneralDetails {...{ packageName }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
