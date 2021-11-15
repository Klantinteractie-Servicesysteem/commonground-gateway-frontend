import * as React from "react"
import Layout from "../../components/common/layout";
import Breadcrumbs from "../../components/common/breadcrumbs";
import { Grid } from "@mui/material";
import ActionMenu from "../../components/common/actionMenu";
import EntitiesTable from "../../components/entities/entitiesTable";


const IndexPage = () => {
  return (
    <Layout>
      <main>
        <Grid container>
          <Grid item sm={3}>
            <ActionMenu />
          </Grid>
          <Grid item sm={9}>
            <Breadcrumbs items={[{ name: 'Home/', href: '/' }, { name: 'Entities' }]} />
            <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">Entities</h1>
            <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">
              U can view your entities here.</h4>
            <div class="utrecht-html">
              <EntitiesTable/>
            </div>
          </Grid>
        </Grid>
      </main>
    </Layout>
  )
}

export default IndexPage
