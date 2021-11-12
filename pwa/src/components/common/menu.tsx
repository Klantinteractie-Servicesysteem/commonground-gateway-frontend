import makeStyles from '@mui/styles/makeStyles';
import * as React from "react";
import {useUserContext} from "../../context/userContext";
import {useUrlContext} from "../../context/urlContext";
import {getUser, isLoggedIn, logout} from "../../services/auth";
import {navigate} from "gatsby-link";
import {useEffect} from "react";
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appbar: {
  },
  text: {
  },
}));


const handleLogout = (context) => {

  if (typeof window !== "undefined") {
    context.setUser(null);
    sessionStorage.setItem('user', null);

    // @ts-ignore
    window.location.href = 'http://localhost/logout';
  }
}

export default function MainMenu() {

  const classes = useStyles();

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
            {
              isLoggedIn() &&
              <span className="utrecht-topnav__link">
              {
                getUser().name
              }
                </span>
            }
          </li>
          <li className="utrecht-topnav__item" >
            {
              isLoggedIn()
                ?
                <span className="utrecht-topnav__link" onClick={handleLogout} >Uitloggen</span>
                :
                <a className="utrecht-topnav__link"
                  href={context.baseUrl + "/digid/login?returnUrl=" + context.frontendUrl + "/redirect"}>
                  Inloggen
                </a>
            }
          </li>
        </ul>
      </nav>
    </div>
  );
}
