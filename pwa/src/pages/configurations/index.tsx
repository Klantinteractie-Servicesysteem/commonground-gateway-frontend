import * as React from "react";
import ConfigurationsExportButton from "../../components/configurationsExportButton/ConfigurationsExportButton";

const IndexPage = () => {
  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="utrecht-page col-3">
            <ConfigurationsExportButton />
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
