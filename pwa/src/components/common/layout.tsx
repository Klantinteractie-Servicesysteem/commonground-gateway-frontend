import * as React from "react";
import Footer from "./../footer/footer";
import MainMenu from "./menu";
import { Helmet } from "react-helmet";
import "bootstrap/dist/css/bootstrap.css";
import { APIProvider } from "../../apiService/apiContext";
import APIService from "../../apiService/apiService";
import { isLoggedIn, logout, validateSession } from "../../services/auth";
import Login from "../../pages/login";
import { AlertProvider, AlertProps } from "../../context/alertContext";
import WelcomeModal from "../welcomeModal/welcomeModal";
import Alert from "../alert/alert";
import { HeaderProvider } from "../../context/headerContext";
import Header from "./header";

/**
 * This components renders a layout which is renders the menu, footer and container surrounding main body of pages.
 *
 * @param {object} children Content that is rendered as body.
 * @returns JSX of the generated Layout.
 */
export default function Layout({ children, pageContext }) {
  const [API, setAPI] = React.useState<APIService>(null);
  const [alert, setAlert] = React.useState<AlertProps>(null);
  const [header, setHeader] = React.useState(null);

  React.useEffect(() => {
    if (!isLoggedIn()) {
      setAPI(null);
      return;
    }

    const jwt = sessionStorage.getItem("jwt");
    !validateSession(jwt) && logout();
    !API && jwt && setAPI(new APIService(jwt));
  }, [API, isLoggedIn()]);

  return API ? (
    <APIProvider value={API}>
      <AlertProvider value={[alert, setAlert]}>
        <HeaderProvider value={[header, setHeader]}>
          <Alert />
          <Helmet>
            <title>Gateway Admin Dashboard</title>
          </Helmet>
          <div className="utrecht-document conduction-theme">
            <div className="utrecht-page">
              <MainMenu />
              <div className="utrecht-page__content">
                <header className="utrecht-page-header">
                  <Header {...{ pageContext }} />
                </header>
                <div className="container py-4">{children}</div>
              </div>
              <Footer />
            </div>
          </div>
          <WelcomeModal />
        </HeaderProvider>
      </AlertProvider>
    </APIProvider>
  ) : (
    <Login />
  );
}
