import makeStyles from '@mui/styles/makeStyles';
import * as React from "react";
import {ThemeSwitcher} from "../theme-switcher/theme-switcher";
import {Grid} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  footerStyle: {
    marginTop: 50
  },
}));

export default function Footer() {
  const style = {
    backgroundColor: '#CBCE1C',
    marginTop: '50px',
    minHeight: '150px'
  }

  return (
    <footer className="utrecht-page-footer">
      <Grid container>
        <Grid item xs={8}>
          <address className="utrecht-page-footer__address utrecht-page-footer__address--reset-address">
            <h2 className="utrecht-heading-2 utrecht-heading-2--reset-h2">Gemeente Demodam</h2>
            <section>
              <h3 className="utrecht-heading-3 utrecht-heading-3--distanced">Telefoon</h3>
              <p className="utrecht-paragraph utrecht-paragraph--distanced">
                <a href="tel:+31302860000" className="utrecht-link utrecht-link--telephone">12345</a>
              </p>
            </section>
            <section>
              <h3 className="utrecht-heading-3 utrecht-heading-3--distanced">Adres</h3>
              <p className="utrecht-paragraph utrecht-paragraph--distanced">
                <strong>Stadskantoor</strong><br />
                Demodamstraat 1<br />

              </p>
            </section>
          </address>
        </Grid>
        <Grid item xs={4}>
          <div style={{marginTop: 'auto', marginLeft: 'auto', width: "fit-content"}}>
            <ThemeSwitcher/>
          </div>
        </Grid>
      </Grid>
    </footer>
  );
}
