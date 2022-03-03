import * as React from "react";
import TranslationForm from "../../../../components/translations/translationForm";
import { HeaderContext } from "../../../../context/headerContext";

const IndexPage = (props) => {
  const id: string = props.params.id === "new" ? null : props.params.id;
  const tableName = props.params.translationId;
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader("Translation");
  }, [setHeader]);

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            <TranslationForm id={id} tableName={tableName} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
