import makeStyles from '@mui/styles/makeStyles';
import * as React from "react";
import {useUserContext} from "../../context/userContext";
import {useUrlContext} from "../../context/urlContext";
import {getUser, isLoggedIn, logout} from "../../services/auth";
import {navigate} from "gatsby-link";
import {useEffect} from "react";
import {Link} from "gatsby";

const handleLogout = (context) => {

  if (typeof window !== "undefined") {
    context.setUser(null);
    sessionStorage.setItem('user', null);

    // @ts-ignore
    window.location.href = 'http://localhost/logout';
  }
}

export default function MainMenu() {

  const handleLogout = () => {
      logout();
      navigate("/");
  }

  let context = useUrlContext();

  return (
    <div className="utrecht-navhtml" >
      <nav className="topnav"   >
        <ul className="utrecht-topnav__list" >
          <li className="utrecht-topnav__item">
            <Link to={'/'} className="utrecht-topnav__link" >Home</Link>
          </li>
          <li className="utrecht-topnav__item">
            <Link to={'/sources'} className="utrecht-topnav__link" >Sources</Link>
          </li>
          <li className="utrecht-topnav__item">
            <Link to={'/entities'} className="utrecht-topnav__link" >Entities</Link>
          </li>
          <li className="utrecht-topnav__item">
            <Link to={'/data'} className="utrecht-topnav__link" >Data objects</Link>
          </li>
          <li className="utrecht-topnav__item" >
            <Link to={'/sources'} className="utrecht-topnav__link" >Sources</Link>
          </li>
          <li className="utrecht-topnav__item" >
            <Link to={'/entities'} className="utrecht-topnav__link" >Entities</Link>
          </li>
          <li className="utrecht-topnav__item" >
            <Link to={'/endpoints'} className="utrecht-topnav__link" >Endpoints</Link>
          </li>
          <li className="utrecht-topnav__item" >
            <Link to={'/applications'} className="utrecht-topnav__link" >Applications</Link>
          </li>
          <li className="utrecht-topnav__item" >
            <Link to={'/users'} className="utrecht-topnav__link" >Users</Link>
          </li>
          <li className="utrecht-topnav__item" >
            <Link to={'/configuration'} className="utrecht-topnav__link" >Configuration</Link>
          </li>
          <li className="utrecht-topnav__item" >
            <Link to={'/logs'} className="utrecht-topnav__link"  >Logs</Link>
          </li>

        </ul>
      </nav>
    </div>
  );
}
