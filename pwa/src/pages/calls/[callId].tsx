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
  const callId: string = props.params.callId;

  React.useEffect(() => {
    setHeader({ title: "Call", subText: "" });
  }, [setHeader]);

  React.useEffect(() => {
    API.Log.getAllFromCall(callId)
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        navigate("/");
        setAlert({ message: "Error getting call logs", type: "danger" });
        throw new Error(`GET Call Logs error: ${err}`);
      });
  }, [API]);

  return logs ? (
    <Card title={`All logs in call: ${callId}`} cardBody={() => <LogsTable {...{ logs }} />} cardHeader={() => <></>} />
  ) : (
    <Spinner />
  );
};

export default IndexPage;
