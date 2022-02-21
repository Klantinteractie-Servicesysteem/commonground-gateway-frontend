import * as React from "react"
import UsersTable from "../../components/users/usersTable";

const IndexPage = () => {
  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            <UsersTable/>
          </div>
        </div>
      </div>
    </main>
  )
}

export default IndexPage;

