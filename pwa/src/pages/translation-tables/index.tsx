import * as React from "react";
import TableNamesTable from "../../components/translations/tableNamesTable";
import {HeaderContext} from "../../context/headerContext";

const IndexPage = () => {

  const [__, setHeader] = React.useContext(HeaderContext);
  
  React.useEffect(() => {
    setHeader({title: 'Translation tables', subText: 'An overview of your translation tables'});
  }, [setHeader]);

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            <TableNamesTable />
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
