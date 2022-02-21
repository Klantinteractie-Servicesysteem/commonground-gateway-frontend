import * as React from "react";
import Layout from "../../components/common/layout";
import ConfigurationsExportButton from "../../components/configurationsExportButton/ConfigurationsExportButton";

const IndexPage = () => {
  return (
    <Layout title={"Configurations"} subtext={"An overview of your endpoints objects"}>
      <title>Gateway - Configurations</title>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="utrecht-page col-3">
              <ConfigurationsExportButton />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
