import * as React from "react";
import Layout from "../../components/common/layout";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import EndpointForm from "../../components/endpoints/endpointForm";
import HandlerTable from "../../components/handlers/handlerTable";
import LogTable from "../../components/logs/logTable/logTable";

const IndexPage = (props) => {
  const [context, setContext] = React.useState(null);
  const endpointId: string = props.params.endpointId === "new" ? null : props.params.endpointId;

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    }
  }, [context]);  

  return (
    <Layout title={"Endpoints"} subtext={"Create or modify your endpoint"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              {props.params.id !== "new" ? (
                <Tabs
                  items={[
                    { name: "Overview", id: "overview", active: true },
                    {
                      name: "Handlers",
                      id: "handlers",
                    },
                    {
                      name: "Logs",
                      id: "logs",
                    }
                  ]}
                />
              ) : (
                <Tabs
                  items={[{ name: "Overview", id: "overview", active: true },
                    {
                      name: "Logs",
                      id: "logs",
                    }]}
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
                <br />
                <EndpointForm {...{endpointId}}/>
              </div>
              <div
                className="tab-pane"
                id="handlers"
                role="tabpanel"
                aria-labelledby="handlers-tab"
              >
                <br />
                <HandlerTable {...{endpointId}} />
              </div>
              <div
                className="tab-pane"
                id="logs"
                role="tabpanel"
                aria-labelledby="logs-tab"
              >
                <br />
                <LogTable id={props.params.id} query={'endpoint.id'}/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
