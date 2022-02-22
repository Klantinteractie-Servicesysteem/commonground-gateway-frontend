import * as React from "react"
import EndpointsTable from "../../components/endpoints/endpointsTable";

const IndexPage = () => {
  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            <EndpointsTable/>
          </div>
        </div>
      </div>
    </main>
  )
}

export default IndexPage;
