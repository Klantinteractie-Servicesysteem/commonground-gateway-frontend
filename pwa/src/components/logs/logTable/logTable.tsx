import * as React from "react";
import "./logTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import LogModal from "../logModal/LogModal";
import LabelWithBackground from "../../LabelWithBackground/LabelWithBackground";
import msToSeconds from "../../../services/msToSeconds";


interface LogsTableProps {
  logs: any;
}

const LogsTable: React.FC<LogsTableProps> = ({ logs }) => {
  return (
    <div className="logsTable">
      <table>
        <thead>
        <tr>
          <th>Status</th>
          <th>Method</th>
          <th>Response time</th>
          <th>Application</th>
          <th>Date created</th>
        </tr>
        </thead>
        {!logs.length && <tr>
          <td>No results found</td>
        </tr>}
        {logs.map((log, idx) => {
          const statusClass = log.responseStatusCode ? log.responseStatusCode > 199 && log.responseStatusCode < 300 ? "success" : "danger" : "danger";
          return (
            <>
              <tr key={idx} className="logsTable-tr">
                <td>
                  <LabelWithBackground label={log?.responseStatusCode?.toString()} type={statusClass} />
                </td>
                <td>{log.requestMethod}</td>
                <td>{`${log.responseTime}ms (${msToSeconds(log.responseTime)}s)`}</td>
                <td>{log.application?.name}</td>
                <td>{new Date(log.createdAt).toLocaleString("nl-NL")}</td>
                <td className="logsTable-viewLogTd">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target={`#logs${log.id.replace(new RegExp("-", "g"), "")}`}
                  >
                    <FontAwesomeIcon icon={faEye} /> View log
                  </button>
                </td>
              </tr>
              <LogModal {...{ log }} />
            </>
          );
        })}
      </table>
    </div>
  );
};

export default LogsTable;
