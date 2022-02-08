import * as React from "react";
import { Tabs } from "@conductionnl/nl-design-system/lib";
import LogTable from "../components/logs/logTable/logTable";
import { getUser, isLoggedIn } from "../services/auth";
import {HeaderContext} from "../context/headerContext";

const IndexPage = () => {
  const [header, setHeader] = React.useContext(HeaderContext);

  // React.useEffect(() => {
  //   setHeader({title: 'Dashboard', subText: isLoggedIn() ? `Welcome ${getUser().username}, to the gateway admin dashboard` : `Welcome to the gateway admin dashboard`})
  // }, [header])

  return (
      isLoggedIn() && (
        <>
          <div className="page-top-item">
            <Tabs
              items={[
                {
                  name: "Logs",
                  id: "logs",
                  active: true,
                },
              ]}
            />
          </div>
          <div className="tab-content">
            <div
              className="tab-pane active"
              id="logs"
              role="tabpanel"
              aria-labelledby="logs-tab">
              <br />
              <LogTable />
            </div>
          </div>
        </>
      )
  );
};

export default IndexPage;
