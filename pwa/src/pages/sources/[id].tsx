import * as React from "react";
import SourceForm from "../../components/sources/sourceForm";

const IndexPage = (props) => {
  const id: string = props.params.id === "new" ? null : props.params.id

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            <SourceForm {...{id}} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
