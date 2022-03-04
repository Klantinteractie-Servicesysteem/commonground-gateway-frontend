import * as React from "react";
import "./dashboardLogsTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import LogModal from "../logs/logModal/LogModal";
import LabelWithBackground from "../LabelWithBackground/LabelWithBackground";
import msToSeconds from "../../services/msToSeconds";

interface DashboardLogsTableProps {
  logs: any;
}

const DashboardLogsTable: React.FC<DashboardLogsTableProps> = ({ logs }) => {
  return (
    <div className="dashboardLogsTable">
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Type</th>
            <th>Method</th>
            <th>Response time</th>
          </tr>
        </thead>
        <tbody>
          {!logs.length && (
            <tr>
              <td>No results found</td>
            </tr>
          )}
          {logs.map((log, idx) => {
            const statusClass = log.responseStatusCode > 199 && log.responseStatusCode < 300 ? "success" : "danger";
            return (
              <tr key={idx} className="dashboardLogsTable-tr">
                <td>
                  <LabelWithBackground label={log.responseStatusCode.toString()} type={statusClass} />
                </td>
                <td>{log.type}</td>
                <td>{log.requestMethod}</td>
                <td>{`${log.responseTime}ms (${msToSeconds(log.responseTime)}s)`}</td>
                <td className="dashboardLogsTable-viewLogTd">
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
            );
          })}
        </tbody>
      </table>

      {logs.map((log) => (
        <LogModal key={log} {...{ log }} />
      ))}
    </div>
  );
};

export default DashboardLogsTable;
