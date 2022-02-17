import * as React from "react";
import "./dashboardLogsTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

interface DashboardLogsTableProps {
  logs: any,
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
          {logs.map((log, idx) => {
            const statusClass = log.status > 199 && log.status < 300 ? "success" : "error";

            return (
              <tr key={idx}>
                <td><span className={`dashboardLogsTable-status ${statusClass}`}>{log.status}</span></td>
                <td>{log.type}</td>
                <td>{log.method}</td>
                <td>{log.responseTime}ms</td>
                <td><FontAwesomeIcon icon={faEye} /></td>
              </tr>
            )
          }
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardLogsTable;
