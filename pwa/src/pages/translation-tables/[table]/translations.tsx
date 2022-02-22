import * as React from "react";
import TranslationTable from "../../../components/translations/translationTable";
import {HeaderContext} from "../../../context/headerContext";

const IndexPage = (props) => {
  const tableName: string = props.params.table;
  const [__, setHeader] = React.useContext(HeaderContext);
  
  React.useEffect(() => {
    setHeader({title: 'Translations', subText: 'An overview of your translations'});
  });

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            <TranslationTable tableName={tableName} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
