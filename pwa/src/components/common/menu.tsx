import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {Stack} from "@mui/material";
import * as React from "react";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },

  appbar: {
    backgroundColor: '#AD9156',
    boxShadow: "none"
  },

}));


export default function MainMenu() {

  const classes = useStyles();

  return (
    <div className="utrecht-navhtml">
      <nav className="topnav">
        <ul className="utrecht-topnav__list">
          <li className="utrecht-topnav__item">
            <a className="utrecht-topnav__link utrecht-topnav__link--current" href="/">Home</a>
          </li>
          <li className="utrecht-topnav__item">
            <a className="utrecht-topnav__link"
               href="https://demodam.org/" target="_blank">Demodam.org</a>
          </li>,
        </ul>
      </nav>
    </div>
  );
}
