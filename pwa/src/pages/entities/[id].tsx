import * as React from "react";
import Layout from "../../components/common/layout";
import AttributeTable from "../../components/attributes/attributeTable";
import EntityRequestTable from "../../components/logs/entityRequestTable";
import DataTable from "../../components/object_entities/dataTable";
import EntityForm from "../../components/entities/entityForm";
import {Tabs} from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import ResponseTable from "../../components/logs/responseTable";
import RequestTable from "../../components/logs/requestTable";
import EntityResponseTable from "../../components/logs/entityResponseTable";

const IndexPage = (props) => {
  const [context, setContext] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    }
  }, [context]);

  return (
    <Layout title={'Entity'} subtext={"Add or modify your entity"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              {props.params.id !== "new" ? (
                <Tabs items={[{name: "Main", id: "main", active: true},
                  {
                    name: "Attributes",
                    id: "attributes",
                  },
                  {name: "Data", id: "data"},
                  {name: "Request logs", id: "request"},
                  {name: "Response logs", id: "response"},
                ]}/>
              ) : (
                <Tabs items={[{name: "Main", id: "main", active: true}]}/>
              )}
            </div>
            <div className="tab-content">
              <div
                className="tab-pane active"
                id="main"
                role="tabpanel"
                aria-labelledby="main-tab"
              >
                <br/>
                <EntityForm id={props.params.id}/>
              </div>
              <div
                className="tab-pane"
                id="attributes"
                role="tabpanel"
                aria-labelledby="attributes-tab"
              >
                <br/>
                <AttributeTable id={props.params.id}/>
              </div>
              <div
                className="tab-pane"
                id="data"
                role="tabpanel"
                aria-labelledby="data-tab"
              >
                <br/>
                <DataTable id={props.params.id}/>
              </div>
              <div
                className="tab-pane active"
                id="response"
                role="tabpanel"
                aria-labelledby="main-tab"
              >
                <br/>
                <EntityResponseTable id={props.params.id}/>
              </div>
              <div
                className="tab-pane"
                id="request"
                role="tabpanel"
                aria-labelledby="attributes-tab"
              >
                <br/>
                <EntityRequestTable id={props.params.id}/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
