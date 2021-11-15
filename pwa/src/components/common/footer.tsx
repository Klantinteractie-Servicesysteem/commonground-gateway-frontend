import makeStyles from '@mui/styles/makeStyles';
import * as React from "react";
import {ThemeSwitcher} from "../theme-switcher/theme-switcher";
import {Grid} from "@mui/material";
import CallIcon from '@mui/icons-material/Call';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Link} from "gatsby";

export default function Footer() {

  return (
    <footer className="utrecht-page-footer">
      <Grid container spacing={{xs: 5}}>
        <Grid item xs={12} sm={4} >
          <Box>
            <h3 className="utrecht-heading-3 utrecht-heading-3--distanced">Diensten</h3>
          </Box>
          <Link to={"/moving"} className="utrecht-link utrecht-link--hover">Verhuizen</Link> <br/>
          <Link to={"/marriage"} className="utrecht-link">Huwelijk</Link> <br/>
          <Link to={"/certificates"} className="utrecht-link">Uittreksels</Link> <br/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box>
            <Typography variant="h3"  className="utrecht-heading-3 utrecht-heading-3--distanced">Contact</Typography>
          </Box>
          <Box>
            <LocationOnIcon/>
          </Box>
          <Box>
            <CallIcon/>
            <a href="tel:14024" className="utrecht-link utrecht-link--telephone">14024</a>
          </Box>
          <Box>
            <MailOutlineIcon/>
            <a href="mailto:gemeente@nijmegen.nl"
               className="utrecht-link utrecht-link--telephone">ifo@demodam.nl</a>
          </Box>
        </Grid>
       <Grid item xs={4}>
          <div>
            <h3 className="utrecht-heading-3 utrecht-heading-3--distanced">Openingstijden</h3>
            <p className="utrecht-paragraph utrecht-paragraph--distanced">
              <strong>Maandag - woensdag: 9.00 - 17.00</strong><br/>
              <strong>Donderdag: 9.00 - 20.00</strong><br/>
              <strong>Vrijdag: 9.00 - 17.00</strong>
            </p>
          </div>
        </Grid>
      </Grid>
    </footer>
  )
    ;
}

