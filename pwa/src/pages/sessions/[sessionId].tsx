import { Card } from "@conductionnl/nl-design-system";
import * as React from "react";
import APIContext from "../../apiService/apiContext";
import APIService from "../../apiService/apiService";
import Spinner from "../../components/common/spinner";
import LogsTable from "../../components/logs/logTable/logTable";
import { HeaderContext } from "../../context/headerContext";

const IndexPage = (props) => {
  const [logs, setLogs] = React.useState(null);
  const [_, setHeader] = React.useContext(HeaderContext);

  const API: APIService = React.useContext(APIContext);
  const sessionId: string = props.params.sessionId;

  React.useEffect(() => {
    setHeader({ title: "Session", subText: "" });
  }, [setHeader]);

  React.useEffect(() => {
    API.Log.getAll()
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        throw new Error(`GET All Logs error: ${err}`);
      });
  }, [API]);

  return logs ? (
    <Card
      title={`All logs in session: ${sessionId}`}
      cardBody={() => <LogsTable {...{ logs }} />}
      cardHeader={() => <></>}
    />
  ) : (
    <Spinner />
  );
};

export default IndexPage;
