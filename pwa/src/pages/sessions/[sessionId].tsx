import * as React from "react";
import APIContext from "../../apiService/apiContext";
import APIService from "../../apiService/apiService";
import LogTable from "../../components/logs/logTable/logTable";
import { HeaderContext } from "../../context/headerContext";

const IndexPage = (props) => {
  const [logs, setLogs] = React.useState(null);
  const [_, setHeader] = React.useContext(HeaderContext);

  const API: APIService = React.useContext(APIContext);
  const sessionId: string = props.params.sessionId;

  React.useEffect(() => {
    setHeader({ title: `Session: ${sessionId}`, subText: "" });
  });

  React.useEffect(() => {
    API.Log.getAll()
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        throw new Error(`GET All Logs error: ${err}`);
      });
  });

  if (!logs) return <>Loading...</>;
};

export default IndexPage;
