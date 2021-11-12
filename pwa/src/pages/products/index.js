import * as React from "react"
import Layout from "../../components/common/layout";
import Breadcrumbs from "../../components/common/breadcrumbs";
import { Card } from "@gemeente-denhaag/denhaag-component-library";
import { Grid } from "@mui/material";
import ActionMenu from "../../components/common/actionMenu";
import { getUser, isLoggedIn, logout } from "../../services/auth";

const IndexPage = () => {

  return (
    <Layout>
      <main>
        <Grid container>
          <Grid item sm={3}>
            <ActionMenu />
          </Grid>
          <Grid item sm={9}>
            <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Diensten', href: '/products' }]} />
            <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">Diensten</h1>
            <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">
              Hier vind u diensten en producten waar u gebruik van kunt maken.
            </h4>
            <Grid container spacing={2}>
              <Grid item sm={4}>
                <Card
                  date={new Date()}
                  href="https://github.com"
                  onClick={function noRefCheck() { }}
                  subTitle="Verhuizen, emigreren, briefadres, geheimhouding persoonsgegevens."
                  title="Verhuizen"
                />
              </Grid>

              <Grid item sm={4}>
                <Card
                  date={new Date()}
                  href="https://github.com"
                  onClick={function noRefCheck() { }}
                  subTitle="Uittreksel burgelijke stand, basisregistratie personen, VOG."
                  title="Uittreksel en verklaringen"
                />
              </Grid>
              <Grid item sm={4}>
                <Card
                  date={new Date()}
                  href="https://github.com"
                  onClick={function noRefCheck() { }}
                  subTitle="Trouwen, geregistreerd partnerschap, scheiden."
                  title="Trouwen, partnerschap, scheiden"
                 />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

      </main>
    </Layout>

  )
}

export default IndexPage
