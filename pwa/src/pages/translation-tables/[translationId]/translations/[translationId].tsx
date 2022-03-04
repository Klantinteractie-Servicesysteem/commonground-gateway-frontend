import * as React from "react";
import TranslationForm from "../../../../components/translations/translationForm";
import { HeaderContext } from "../../../../context/headerContext";

const IndexPage = (props) => {
  const translationId: string = props.params.translationId === "new" ? null : props.params.translationId;
  const subtext: string = props.params.translationId === "new" ? 'Create a new translation' : 'View or edit this translation'
  const tableName = props.params.translationId;
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader({title: 'Translation', subText: subtext});
  }, [setHeader]);

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            <TranslationForm translationId={translationId} tableName={tableName} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
