import * as React from "react";
import "./dashboard.css";
import { DashboardCard, DashboardCardSmall } from "./../../components/dashboardCard/DashboardCard";
import CallHealthQuickview from "./../../components/callHealthQuickview/CallHealthQuickview";
import LogsTable from "../../components/logs/logTable/logTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import applicationsIcon from "./../../images/icon-applications.svg";
import sourcesIcon from "./../../images/icon-sources.svg";
import endpointsIcon from "./../../images/icon-endpoints.svg";
import conductionIcon from "./../../images/icon-conduction.svg";
import Spinner from "../../components/common/spinner";
import { Card, Modal } from "@conductionnl/nl-design-system";
import { useQuery } from "react-query";
import { Link } from "gatsby";

const Dashboard: React.FC = () => {
  const [logs, setLogs] = React.useState(null);
  const [logsDocumentation, setLogsDocumentation] = React.useState(null);
  const [applicationsCount, setApplicationsCount] = React.useState<number>(0);
  const [sourcesCount, setSourcesCount] = React.useState<number>(0);
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => {
    handleSetCounts();
    handleSetLogs();
  }, [API]);

  const getEndpointsQuery = useQuery<any[], Error>("endpoints", API.Endpoint.getAll);
  const getRepositoriesQuery = useQuery<any[], Error>("repositories", API.Repository.getAll);

  const handleSetLogs = (): void => {
    logs && setLogs(null);

    API.Log.getAllIncoming()
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        throw new Error(`GET Incoming Logs error: ${err}`);
      });
  };

  const handleSetLogsDocumentation = (): void => {
    API.Documentation.get("logs")
      .then((res) => {
        setLogsDocumentation(res.data.content);
      })
      .catch((err) => {
        throw new Error(`GET Logs documentation error: ${err}`);
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
  };

  return (
    <div className="dashboard">
      <div>
        <h3 className="dashboard-dividerTitle">Quick overview</h3>
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
            amount={getEndpointsQuery.isSuccess ? getEndpointsQuery.data.length : 0}
            title="Endpoints"
            iconBackgroundColor="31CE36"
            icon={<img src={endpointsIcon} alt="endpoints" />}
            subtitle="View all endpoints"
            linkTo="endpoints"
          />

          <DashboardCard
            amount={getRepositoriesQuery.isSuccess ? getRepositoriesQuery.data.length : 0}
            title="Collection Store"
            iconBackgroundColor="5bc0de"
            icon={<i className="fas fa-shopping-cart fa-lg"/>}
            subtitle="View all github repositories"
            linkTo="shop"
          />
        </div>
      </div>

      <div className="dashboard-row-logsAndDocumentation">
        <div className="dashboard-logsTable">
          <h3 className="dashboard-dividerTitle">Recent activity</h3>

          <Card
            title="Incoming calls"
            cardBody={() => (logs ? <LogsTable {...{ logs }} /> : <Spinner />)}
            cardHeader={() => (
              <>
                <button
                  className="utrecht-link button-no-style"
                  data-bs-toggle="modal"
                  data-bs-target="#logsHelpModal"
                  onClick={handleSetLogsDocumentation}
                >
                  <i className="fas fa-question mr-1" />
                  <span className="mr-2">Help</span>
                </button>
                <Modal
                  title="Logs Documentation"
                  id="logsHelpModal"
                  body={() =>
                    logsDocumentation ? <div dangerouslySetInnerHTML={{ __html: logsDocumentation }} /> : <Spinner />
                  }
                />
                <a className="utrecht-link" onClick={handleSetLogs}>
                  <i className="fas fa-sync-alt mr-1" />
                  <span className="mr-2">Refresh</span>
                </a>
              </>
            )}
          />
        </div>

        <div className="dashboard-externalLinks">
          <h3 className="dashboard-dividerTitle">Documentation and support</h3>

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
