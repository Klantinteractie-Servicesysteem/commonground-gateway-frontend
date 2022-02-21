import * as React from "react";
import ApplicationForm from "../../components/applications/applicationForm";

const IndexPage = (props) => {
  const id: string = props.params.id === "new" ? null : props.params.id;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <ApplicationForm {...{ id }} />
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
