import * as React from "react";
import Layout from "../../components/common/layout";
import TranslationForm from "../../components/translations/translationForm";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import ResponseTable from "../../components/logs/responseTable";
import RequestTable from "../../components/logs/requestTable";

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
    <Layout title={"Translation"} subtext={"Create or modify your translation"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              {props.params.id !== "new" ? (
                <Tabs
                  items={[
                    { name: "Overview", id: "overview", active: true }
                  ]}
                />
              ) : (
                <Tabs
                  items={[{ name: "Overview", id: "overview", active: true }]}
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
                <TranslationForm id={props.params.id} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
