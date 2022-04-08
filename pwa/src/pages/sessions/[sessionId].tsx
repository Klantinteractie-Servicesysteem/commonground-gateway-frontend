import { Card, Modal } from "@conductionnl/nl-design-system";
import * as React from "react";
import APIContext from "../../apiService/apiContext";
import APIService from "../../apiService/apiService";
import Spinner from "../../components/common/spinner";
import LogsTable from "../../components/logs/logTable/logTable";
import { HeaderContext } from "../../context/headerContext";
import { useLog } from "../../hooks/log";

const IndexPage = (props) => {
  const [logsDocumentation, setLogsDocumentation] = React.useState(null);
  const [_, setHeader] = React.useContext(HeaderContext);

  const API: APIService = React.useContext(APIContext);
  const sessionId: string = props.params.sessionId;

  const _useLog = useLog();
  const getLogsFromSession = _useLog.getAllFromSession(sessionId);

  React.useEffect(() => {
    setHeader("Session");
  }, [setHeader]);

  const handleSetLogsDocumentation = (): void => {
    API.Documentation.get("logs")
      .then((res) => {
        setLogsDocumentation(res.data.content);
      })
      .catch((err) => {
        throw new Error(`GET Logs documentation error: ${err}`);
      });
  };

  return (
    <Card
      title={`All logs in session: ${sessionId}`}
      cardBody={() => (getLogsFromSession.isLoading ? <Spinner /> : <LogsTable logs={getLogsFromSession.data ?? []} />)}
      cardHeader={() => (
        <>
          <button
            className="utrecht-link button-no-style"
            data-bs-toggle="modal"
            data-bs-target="#logsHelpModal"
            onClick={handleSetLogsDocumentation}
          >
            <i className="fas fa-question mr-1" />
            <span className="mr-2">Help</span>
          </button>
          <Modal
            title="Logs Documentation"
            id="logsHelpModal"
            body={() =>
              logsDocumentation ? <div dangerouslySetInnerHTML={{ __html: logsDocumentation }} /> : <Spinner />
            }
          />
          <button
            className="button-no-style utrecht-link"
            disabled={getLogsFromSession.isFetching}
            onClick={() => {
              getLogsFromSession.refetch();
            }}
          >
            <i className="fas fa-sync-alt mr-1" />
            <span className="mr-2">{getLogsFromSession.isFetching ? "Fetching data..." : "Refresh"}</span>
          </button>
        </>
      )}
    />
  );
};

export default IndexPage;
