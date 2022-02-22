import * as React from "react";
import TranslationTableForm from "../../components/translations/TranslationTableForm";
import { HeaderContext } from "../../context/headerContext";

const IndexPage = () => {

  const [__, setHeader] = React.useContext(HeaderContext);
  
  React.useEffect(() => {
    setHeader({title: 'Translation table', subText: 'Create a new translation table'});
  });

  return (
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <TranslationTableForm tableName="new" />
            </div>
          </div>
        </div>
      </main>
  )
}

export default IndexPage;
