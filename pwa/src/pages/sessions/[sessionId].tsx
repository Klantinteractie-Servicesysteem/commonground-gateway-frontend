import { Card } from "@conductionnl/nl-design-system";
import { navigate } from "gatsby-link";
import * as React from "react";
import APIContext from "../../apiService/apiContext";
import APIService from "../../apiService/apiService";
import Spinner from "../../components/common/spinner";
import LogsTable from "../../components/logs/logTable/logTable";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";

const IndexPage = (props) => {
  const [logs, setLogs] = React.useState(null);
  const [_, setHeader] = React.useContext(HeaderContext);
  const [__, setAlert] = React.useContext(AlertContext);

  const API: APIService = React.useContext(APIContext);
  const sessionId: string = props.params.sessionId;

  React.useEffect(() => {
    setHeader({ title: "Session", subText: "" });
  }, [setHeader]);

  React.useEffect(() => {
    API.Log.getAllFromSession(sessionId)
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        navigate("/");
        setAlert({ message: "Error getting session logs", type: "danger" });
        throw new Error(`GET Session Logs error: ${err}`);
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
