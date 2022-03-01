import * as React from "react";
import "./dashboard.css";
import { DashboardCard, DashboardCardSmall } from "./../../components/dashboardCard/DashboardCard";
import CallHealthQuickview from "./../../components/callHealthQuickview/CallHealthQuickview";
import DashboardLogsTable from "../../components/dashboardLogsTable/DashboardLogsTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import _logs from "../../dummy_data/logs";

import applicationsIcon from "./../../images/icon-applications.svg";
import sourcesIcon from "./../../images/icon-sources.svg";
import endpointsIcon from "./../../images/icon-endpoints.svg";
import conductionIcon from "./../../images/icon-conduction.svg";

const Dashboard: React.FC = () => {
  const [logs, setLogs] = React.useState(null);
  const [applicationsCount, setApplicationsCount] = React.useState<number>(0);
  const [sourcesCount, setSourcesCount] = React.useState<number>(0);
  const [endpointsCount, setEndpointsCount] = React.useState<number>(0);
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => {
    handleSetCounts();
    handleSetLogs();
  }, [API]);

  const handleSetLogs = (): void => {
    API.Log.getAll()
      .then((res) => {
        res.data.length && setLogs(res.data);
      })
      .catch((err) => {
        throw new Error(`GET Logs error: ${err}`);
      });
  };

  const handleSetCounts = (): void => {
    API.Application.getAll()
      .then((res) => {
        setApplicationsCount(res.data.length);
      })
      .catch((err) => {
        throw new Error(`GET applications error: ${err}`);
      });

    API.Source.getAll()
      .then((res) => {
        setSourcesCount(res.data.length);
      })
      .catch((err) => {
        throw new Error(`GET sources error: ${err}`);
      });

    API.Endpoint.getAll()
      .then((res) => {
        setEndpointsCount(res.data.length);
      })
      .catch((err) => {
        throw new Error(`GET endpoints error: ${err}`);
      });
  };

  return (
    <div className="dashboard">
      <div>
        <h3 className="dashboard-dividerTitle">
          Quick overview
        </h3>
        <div className="dashboard-quickOverview">
          <DashboardCard
            amount={applicationsCount}
            title="Applications"
            iconBackgroundColor="6861CE"
            icon={<img src={applicationsIcon} alt="applications" />}
            subtitle={<CallHealthQuickview healthyCallsAmount={3} unhealthyCallsAmount={1} />}
            linkTo="/applications"
          />

          <DashboardCard
            amount={sourcesCount}
            title="Sources"
            iconBackgroundColor="FFAD46"
            icon={<img src={sourcesIcon} alt="sources" />}
            subtitle={<CallHealthQuickview healthyCallsAmount={18} unhealthyCallsAmount={3} />}
            linkTo="sources"
          />

          <DashboardCard
            amount={endpointsCount}
            title="Endpoints"
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
            <DashboardLogsTable logs={logs ?? _logs} />
          </div>
        </div>

        <div className="dashboard-externalLinks">
          <h3 className="dashboard-dividerTitle">
            Documentation and support
          </h3>

          <DashboardCardSmall
            title="Documentation"
            subtitle="View the Read The Docs"
            iconBackgroundColor="979797"
            icon={<FontAwesomeIcon icon={faBook} />}
            linkTo="https://commonground-gateway.readthedocs.io/en/latest/"
          />

          <DashboardCardSmall
            title="Conduction"
            subtitle="Get in touch"
            iconBackgroundColor="4276FC"
            icon={<img src={conductionIcon} alt="conduction" />}
            linkTo="https://conduction.nl"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
