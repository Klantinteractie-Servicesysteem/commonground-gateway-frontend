import * as React from "react";
import ApplicationForm from "../../components/applications/applicationForm";

const IndexPage = (props) => {
  const applicationId: string = props.params.applicationId === "new" ? null : props.params.applicationId;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <ApplicationForm {...{ applicationId }} />
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
