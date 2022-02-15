import * as React from "react";
import "./dashboard.css"
import { DashboardCard } from "./../../components/dashboardCard/DashboardCard"
import CallHealthQuickview from "./../../components/callHealthQuickview/CallHealthQuickview"
import DashboardLogsTable from "../../components/dashboardLogsTable/DashboardLogsTable";
import { DashboardLogs } from "../../dummy_data/dashboardLog";

import applicationsIcon from "./../../images/icon-applications.svg";
import sourcesIcon from "./../../images/icon-sources.svg";
import endpointsIcon from "./../../images/icon-endpoints.svg";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div>
        <h3 className="dashboard-dividerTitle">
            To your personalized dashboard
        </h3>
        <h2 className="dashboard-title">
          Welcome
        </h2>
      </div>

      <div>
        <h3 className="dashboard-dividerTitle">
            Quick overview
        </h3>
        <div className="dashboard-quickOverview">
          <DashboardCard
            amount={4}
            title="Applications"
            linkType="internal"
            iconBackgroundColor="6861CE"
            icon={<img src={applicationsIcon} alt="applications" />}
            subtitle={<CallHealthQuickview healthyCallsAmount={3} unhealthyCallsAmount={1} />}
            linkTo="/applications"
          />

          <DashboardCard
            amount={16}
            title="Sources"
            linkType="internal"
            iconBackgroundColor="FFAD46"
            icon={<img src={sourcesIcon} alt="sources" />}
            subtitle={<CallHealthQuickview healthyCallsAmount={18} unhealthyCallsAmount={3} />}
            linkTo="sources"
          />

          <DashboardCard
            amount={88}
            title="Endpoints"
            linkType="internal"
            iconBackgroundColor="31CE36"
            icon={<img src={endpointsIcon} alt="endpoints" />}
            subtitle="View all endpoints"
            linkTo="endpoints"
          />
        </div>
      </div>

      <div className="dashboard-row-logsAndDocumentation">
        <div className="dashboard-logsTable">
          <h3 className="dashboard-dividerTitle">
            Recent activity (logs)
          </h3>

          <div className="dashboard-logsTableContainer">
            <span className="title">Activity</span>
            <span className="subtitle">View all logged activities of the last 24 hours</span>
            <DashboardLogsTable logs={DashboardLogs} />
          </div>
        </div>

        <div className="dashboard-externalLinks">
          Documentation and support
        </div>
      </div>
    </div>
  )
}

export default Dashboard
