import * as React from "react"
import Layout from "../../components/common/layout";
import EntitiesTable from "../../components/entities/entitiesTable";
import {Link} from "gatsby";

const IndexPage = () => {
  return (
    <Layout title={"Entities"} subtext={"An overview of your Entity objects"}>
      <main>
        <div className="row">
          <div className="col-12">
            <Link to="/entities/new">
              <button className="utrecht-button float-right" type="button">Create entity</button>
            </Link>

            <div className="utrecht-html">
              <EntitiesTable/>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
