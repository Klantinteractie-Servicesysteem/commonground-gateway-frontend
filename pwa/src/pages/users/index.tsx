import * as React from "react";
import Layout from "../../components/common/layout";
import UsersTable from "../../components/users/usersTable";

const IndexPage = () => {
  return (
    <Layout title={"Users"} subtext={"An overview of your users"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <UsersTable />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
