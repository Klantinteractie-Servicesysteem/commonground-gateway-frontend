import * as React from "react";
import TranslationForm from "../../../../components/translations/translationForm";
import { HeaderContext } from "../../../../context/headerContext";

const IndexPage = (props) => {
  const id: string = props.params.id === "new" ? null : props.params.id;
  const subtext: string = props.params.id === "new" ? 'Create a new translation' : 'View or edit this translation'
  const tableName = props.params.table;
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader({title: 'Translation', subText: 'View or edit this translation'});
  });

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
