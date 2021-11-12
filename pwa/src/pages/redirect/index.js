import * as React from "react"
import Layout from "../../components/common/layout";
import {useEffect} from "react";
import {useUrlContext} from "../../context/urlContext";
import {navigate} from "gatsby-link";
import {setUser} from "../../services/auth";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from '@mui/material/Grid';

const Redirect = () => {

  const urlContext = useUrlContext();

  const handleLogin = () => {
    fetch(urlContext.meUrl, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(function(response) {
        if(response.ok)
        {
          return response.json();
        }

        throw new Error('Something went wrong.');
      })
      .then(function(data) {
        setUser(data);
        navigate("/" + urlContext.loginRedirect);
      })
      .catch(function(error) {
        navigate("/");
      });
  }

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <Layout>
      <main>
        <Grid container spacing={2} sx={{textAlign: "center", marginBottom: '200px', marginTop: '100px'}}>
          <Grid item xs={12}>
            <h1 className="utrecht-heading-1">
              Aan het inloggen
            </h1>
          </Grid>
          <Grid item xs={12}>
            <h4 className="utrecht-heading-4">
                even geduld alstublieft..
            </h4>
          </Grid>
          <Grid item xs={12}>
            <div>
              <CircularProgress size={80} />
            </div>
          </Grid>
        </Grid>
      </main>
    </Layout>

  )
}

export default Redirect;
