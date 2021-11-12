import * as React from "react"
import Layout from "../../components/common/layout";
import Breadcrumbs from "../../components/common/breadcrumbs";
import { Grid } from "@mui/material";
import ActionMenu from "../../components/common/actionMenu";
import { documentDownload } from "../../components/utility/DocumentDownload";
import { useEffect } from 'react';
import { getUser, isLoggedIn, logout } from "../../services/auth";
import { navigate } from "gatsby-link";
import { useUrlContext } from "../../context/urlContext";

function Index() {

  const context = useUrlContext();

  const [claims, setClaims] = React.useState(null);

  useEffect(() => {
    if (getUser() !== undefined && getUser() !== null) {
      fetch(context.apiUrl + "/gateways/waardepapieren-register/certificates?person=" + getUser().bsn, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then(response => response.json())
        .then((data) => {
          setClaims(data['hydra:member']);
          console.log('Certs:')
          console.log(data)
        });
    }
      }, []);

  return <>
    <Layout>
      <main>
        <Grid container>
          <Grid item sm={3}>
            <ActionMenu />
          </Grid>
          <Grid item sm={9}>
            <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Mijn kluis', href: '/vault' } ]} />
            <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">Mijn kluis</h1>
            <div className="utrecht-html">
              <table lang="nl" summary="Overzicht van de stemmen voor en tegen het betaald parkeren." style={{width: "100%"}}>
                <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Aangemaakt op</th>
                  <th scope="col">Pdf</th>
                  <th scope="col">QR</th>
                </tr>
                </thead>
                <tbody>
                  {
                    claims !== null ?
                    claims.map((row) => (
                    <tr>
                      <td>{row.name}</td>
                      <td>{row.dateCreated}</td>
                        <td>{documentDownload(row.document, row.name, ".pdf")}</td>
                      <td>QR CODE</td>
                      </tr>
                    )) :
                    <tr>
                        <td>No results found</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </Grid>
        </Grid>
      </main>
    </Layout>
  </>

}
export default Index
