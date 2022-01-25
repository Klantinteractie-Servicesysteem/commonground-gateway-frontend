import * as React from "react";
import Layout from "../../components/common/layout";
import SourceForm from "../../components/sources/sourceForm";

const IndexPage = (props) => {
  const id: string = props.params.id === "new" ? null : props.params.id

  return (
    <Layout title={"Source"} subtext={"Edit your source here"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <SourceForm {...{id}} />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
