import * as React from "react";
import Layout from "../../components/common/layout";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import SourceForm from "../../components/sources/sourceForm";
import LogTable from "../../components/logs/logTable/logTable";

const IndexPage = (props) => {
  const id: string = props.params.id === "new" ? null : props.params.id;

  return (
    <Layout title={"Source"} subtext={"Edit your source here"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              {id && (
                <Tabs
                  items={[
                    { name: "Overview", id: "overview", active: true },
                    { name: "Logs", id: "logs" }
                  ]}
                />
              )}
              <div className="tab-content">
                <div
                  className="tab-pane active"
                  id="overview"
                  role="tabpanel"
                  aria-labelledby="overview-tab"
                >
                  <br />
                  <SourceForm {...{ id }} />
                </div>
                <div
                  className="tab-pane"
                  id="logs"
                  role="tabpanel"
                  aria-labelledby="logs-tab"
                >
                  <br />
                  <LogTable sourceId={id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
