import { Card } from "@conductionnl/nl-design-system";
import * as React from "react"
import Layout from "../../components/common/layout";
import ConfigurationsExportButton from "../../components/configurations_export_button/ConfigurationsExportButton";

const IndexPage = () => {
  return (
    <Layout title={"Configurations"} subtext={"An overview of your configurations"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <Card
                title={"Configurations"}
                cardHeader={() => <></>}
                cardBody={function () {
                  return (
                    <div className="row">
                      <div className="col-12">
                        <ConfigurationsExportButton/>
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
