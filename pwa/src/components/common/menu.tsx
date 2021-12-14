import * as React from "react";
import { Link } from "gatsby";
// import Modal from "./modal";
import Modal from "@conductionnl/nl-design-system/lib/Modal/src/modal";
import { isLoggedIn, logout } from "../../services/auth";
import { navigate } from "gatsby-link";


/**
 * This components renders the main menu.
 *
 * @returns TSX of the generated MainMenu.
 */
export default function MainMenu() {
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  React.useEffect(() => {
    console.log(isLoggedIn());
  }, []);

  return (
    <div className="utrecht-navhtml">
      <nav className="topnav utrecht-topnav__list">
        <div className="container">
          <div className="d-inline">
            <ul className="utrecht-topnav__list" >
              <li>
                <div className="d-flex align-items-center h-100 justify-content-center">
                  <a href="https://conduction.nl" target="_blank">
                    <img className="logo" alt="" src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGFhZ18xIiBkYXRhLW5hbWU9IkxhYWcgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHBhdGggZD0iTTE0OS43MiwyOCwzOCw5Mi41djEyOUwxNDkuNzIsMjg2bDExMS43Mi02NC41VjkyLjVaTTIzMywyMDUuMDZsLTgzLjI1LDQ4LjA3TDY2LjQ3LDIwNS4wNlYxMDguOTRsODMuMjUtNDguMDdMMjMzLDEwOC45NFoiIHN0eWxlPSJmaWxsOiNmZmYiLz48cG9seWdvbiBwb2ludHM9IjE0OS40NCAxMjQuNTIgMTc1LjYxIDEzOS42MiAyMDYuMDUgMTIyLjA0IDE0OS40NCA4OS4zNiA5MC44NyAxMjMuMTggOTAuODcgMTkwLjgyIDE0OS40NCAyMjQuNjQgMjA2LjA1IDE5MS45NiAxNzUuNjEgMTc0LjM4IDE0OS40NCAxODkuNDggMTIxLjMyIDE3My4yNCAxMjEuMzIgMTQwLjc2IDE0OS40NCAxMjQuNTIiIHN0eWxlPSJmaWxsOiNmZmYiLz48L3N2Zz4=" />
                  </a>
                </div>
              </li>
              <li className="utrecht-topnav__item">
                <Link to={'/'} className="utrecht-topnav__link" >Dashboard</Link>
              </li>
              <li className="utrecht-topnav__item">
                <Link to={'/sources'} className="utrecht-topnav__link" >Sources</Link>
              </li>
              <li className="utrecht-topnav__item">
                <Link to={'/entities'} className="utrecht-topnav__link" >Entities</Link>
              </li>
              <li className="utrecht-topnav__item" >
                <Link to={'/endpoints'} className="utrecht-topnav__link" >Endpoints</Link>
              </li>
              <li className="utrecht-topnav__item" >
                <Link to={'/applications'} className="utrecht-topnav__link" >Applications</Link>
              </li>
              {/*<li className="utrecht-topnav__item" >*/}
              {/*  <Link to={'/users'} className="utrecht-topnav__link" >Users</Link>*/}
              {/*</li>*/}
              {/*<li className="utrecht-topnav__item" >*/}
              {/*  <Link to={'/configuration'} className="utrecht-topnav__link" >Configuration</Link>*/}
              {/*</li>*/}
              <li className="utrecht-topnav__item" >
                <Link to={'/logs'} className="utrecht-topnav__link"  >Logs</Link>
              </li>
              {isLoggedIn() ? (
                <li className="utrecht-topnav__item">
                <a className="utrecht-topnav__link" >
                  <span onClick={handleLogout} style={{ height: "50%", width: "auto", display: "block", borderLeft: "1px solid white" }}>
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Uitloggen
                  </span>
                  </a>
                </li>
              ) : (
                <li className="utrecht-topnav__item">
                  <a data-toggle="modal" data-target={"#loginModal"} className="utrecht-topnav__link" >
                    <span style={{ height: "50%", width: "auto", display: "block", borderLeft: "1px solid white" }}>
                      Login
                    </span>
                  </a>
                  <Modal id="loginModal" title="login" body={function () { return <>Test</> }} />
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
