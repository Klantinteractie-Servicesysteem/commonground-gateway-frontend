import * as React from "react"
import ApplicationsTable from "../../components/applications/applicationsTable";
import {HeaderContext} from "../../context/headerContext";

const IndexPage = () => {
  const [header, setHeader] = React.useContext(HeaderContext);

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            <ApplicationsTable/>
          </div>
        </div>
      </div>
    </main>
  )
}

export default IndexPage
