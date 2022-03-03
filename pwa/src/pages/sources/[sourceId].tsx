import * as React from "react";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import SourceForm from "../../components/sources/sourceForm";
import LogTable from "../../components/logs/logTable/logTable";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

const IndexPage = (props) => {
  const sourceId: string = props.params.sourceId === "new" ? null : props.params.sourceId;
  const API: APIService = React.useContext(APIContext);
  const [logs, setLogs] = React.useState([]);

  React.useEffect(() => {
    handleSetLogs();
  }, [API]);

  const handleSetLogs = (): void => {
    API.Log.getAllFromSource(sourceId)
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        throw new Error(`GET Logs error: ${err}`);
      });
  };

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            {sourceId && (
              <Tabs
                items={[
                  {
                    name: "Overview",
                    id: "overview",
                    active: true
                  },
                  {
                    name: "Logs",
                    id: "logs"
                  }
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
                <SourceForm {...{ sourceId }} />
              </div>
              <div
                className="tab-pane"
                id="logs"
                role="tabpanel"
                aria-labelledby="logs-tab"
              >
                <br />
                <LogTable logs={logs} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
