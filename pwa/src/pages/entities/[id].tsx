import * as React from "react";
import Layout from "../../components/common/layout";
import AttributeTable from "../../components/attributes/attributeTable";
import DataTable from "../../components/object_entities/dataTable";
import EntityForm from "../../components/entities/entityForm";
import {Tabs} from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import ResponseTable from "../../components/logs/responseTable";
import RequestTable from "../../components/logs/requestTable";

const IndexPage = (props) => {
  const id: string = props.params.id === "new" ? null : props.params.id
  const [context, setContext] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    }
  }, [context]);

  return (
    <Layout title={"Entity"} subtext={"Create or modify your entity"} pageContext={props.pageContext}>
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
                    {name: "Data", id: "data"},
                    {name: "Incoming calls", id: "request"},
                    {name: "Outgoing calls", id: "response"},
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
                <EntityForm {...{id}}/>
              </div>
              <div
                className="tab-pane"
                id="attributes"
                role="tabpanel"
                aria-labelledby="attributes-tab"
              >
                <br/>
                <AttributeTable {...{id}}/>
              </div>
              <div
                className="tab-pane"
                id="data"
                role="tabpanel"
                aria-labelledby="data-tab"
              >
                <br/>
                <DataTable {...{id}}/>
              </div>
              <div
                className="tab-pane"
                id="response"
                role="tabpanel"
                aria-labelledby="response-tab"
              >
                <br/>
                <ResponseTable {...{id}}/>
              </div>
              <div
                className="tab-pane"
                id="request"
                role="tabpanel"
                aria-labelledby="request-tab"
              >
                <br/>
                <RequestTable {...{id}}/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
