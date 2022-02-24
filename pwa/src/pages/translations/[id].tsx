import * as React from "react";
import TranslationForm from "../../components/translations/translationForm";
import {Tabs} from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import TranslationTable from "../../components/translations/translationTable";

const IndexPage = (props) => {
  const tableName: string = props.params.id === "new" ? null : props.params.id;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            {tableName && (
              <Tabs
                items={[
                  {name: "Add", id: "overview", active: true},
                  {name: "Translations", id: "translations"}
                ]}
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
              <TranslationForm {...{ tableName }}/>
            </div>
            <div
              className="tab-pane"
              id="translations"
              role="tabpanel"
              aria-labelledby="translations-tab"
            >
              <br/>

              <TranslationTable {...{ tableName }}/>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
