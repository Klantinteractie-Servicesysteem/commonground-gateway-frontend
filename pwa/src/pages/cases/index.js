import * as React from "react"
import Layout from "../../components/common/layout";
import Breadcrumbs from "../../components/common/breadcrumbs";
import { Grid } from "@mui/material";
import ActionMenu from "../../components/common/actionMenu";

const IndexPage = () => {

  return (
      <Layout>
      <main>
        <Grid container>
          <Grid item sm={3}>
            <ActionMenu />
          </Grid>
          <Grid item sm={9}>
        <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Mijn aanvragen', href: '/cases' }]} />
            <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">Mijn aanvragen</h1>
            <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">
              Hier vind u uw bestaande aanvragen voor verschillende zaken.
        </h4>

        <div class="utrecht-html">
          <table lang="nl" summary="Overzicht van de stemmen voor en tegen het betaald parkeren." style={{ width: "100%" }}>
            <caption>Hier kunnen we een caption neerzetten</caption>
            <thead>
              <tr>
                <th scope="col">Type</th>
                <th scope="col" class="numeric">Status</th>
                <th scope="col" class="numeric">Startdatum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Huwelijk</td>
                <td class="numeric">Pending</td>
                <td class="numeric">8-11-2021</td>
              </tr>
            </tbody>
          </table>
            </div>
            </Grid>
            </Grid>
        </main>
      </Layout>

  )
}

export default IndexPage
