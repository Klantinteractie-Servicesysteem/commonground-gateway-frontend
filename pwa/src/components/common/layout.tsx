import * as React from "react";
import Footer from "./../footer/footer";
import MainMenu from "./menu";
import { Helmet } from "react-helmet";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./header";
import { APIProvider } from "../../apiService/apiContext";
import APIService from "../../apiService/apiService";
import {isLoggedIn, logout} from "../../services/auth";
import Login from "../../pages/login";
import WelcomeModal from "../welcomeModal/welcomeModal";
import favicon from "../../images/conduction_logo_blauw.svg";
import {navigate} from "gatsby-link";

/**
 * This components renders a layout which is renders the menu, footer and container surrounding main body of pages.
 *
 * @param {object} children Content that is rendered as body.
 * @param {string|null} title Title for the page.
 * @param {string|null} subText Subtext for the site.
 * @returns TSX of the generated Layout.
 */
export default function Layout({ children, title = "", subtext = "" }) {
  const [API, setAPI] = React.useState<APIService>(null);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };
  const decodedJwt = parseJwt(sessionStorage.getItem('jwt'));

  React.useEffect(() => {
    if (!isLoggedIn()) {
      setAPI(null);
      return;
    }

    const jwt = sessionStorage.getItem("jwt");
    !API && jwt && setAPI(new APIService(jwt));
  }, [API, isLoggedIn()]);

  return (
    API ? (
      <APIProvider value={API}>
        <Helmet
          link={[
            { rel: "shortcut icon", type: "image/png", href: favicon }
          ]}
        >
          <title>Gateway Admin Dashboard</title>
        </Helmet>
        <div className="utrecht-document conduction-theme">
          <div className="utrecht-page">
            <MainMenu />
            <div className="utrecht-page__content">
              <Header title={title} subText={subtext} />
              <div className="container py-4">{children}</div>
            </div>
            <Footer />
          </div>
        </div>
        <WelcomeModal />
      </APIProvider>
    ) : <Login />
  );
}
