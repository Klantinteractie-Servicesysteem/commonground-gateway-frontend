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

interface ILogTableColumns {
  hideStatus?: boolean;
  hideMethod?: boolean;
  hideResponseTime?: boolean;
  hideApplication?: boolean;
  hideDateCreated?: boolean;
  hideModal?: boolean;
}

const LogsTable: React.FC<LogsTableProps & ILogTableColumns> = ({
  logs,
  hideModal,
  hideApplication,
  hideDateCreated,
  hideMethod,
  hideResponseTime,
  hideStatus,
}) => {
  return (
    <div className="logsTable">
      <table>
        <thead>
          <tr>
            {!hideStatus && <th>Status</th>}
            {!hideMethod && <th>Method</th>}
            {!hideResponseTime && <th>Response time</th>}
            {!hideApplication && <th>Application</th>}
            {!hideDateCreated && <th>Date created</th>}
          </tr>
        </thead>
        {logs.map((log, idx) => {
          const statusClass = log.responseStatusCode
            ? log.responseStatusCode > 199 && log.responseStatusCode < 300
              ? "success"
              : "danger"
            : "danger";
          return (
            <tbody>
              <tr key={`log${idx}`} className="logsTable-tr">
                {!hideStatus && (
                  <td>
                    <LabelWithBackground label={log?.responseStatusCode?.toString()} type={statusClass} />
                  </td>
                )}
                {!hideMethod && <td>{log.requestMethod}</td>}
                {!hideResponseTime && <td>{`${log.responseTime}ms (${msToSeconds(log.responseTime)}s)`}</td>}
                {!hideApplication && <td>{log.application?.name}</td>}
                {!hideDateCreated && <td>{new Date(log.createdAt).toLocaleString("nl-NL")}</td>}
                {!hideModal && (
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
                )}
              </tr>
            </tbody>
          );
        })}
        {!logs.length && (
          <tbody>
            <tr>No results found</tr>
          </tbody>
        )}
      </table>
      {!hideModal && logs.map((log, idx) => <LogModal key={`logModal${idx}`} {...{ log }} />)}
    </div>
  );
};

export default LogsTable;
