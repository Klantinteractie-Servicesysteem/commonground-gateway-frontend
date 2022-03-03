import * as React from "react";
import TranslationTable from "../../../components/translations/translationTable";
import { HeaderContext } from "../../../context/headerContext";
import APIService from "../../../apiService/apiService";
import APIContext from "../../../apiService/apiContext";

const IndexPage = (props) => {
  const translationId: string = props.params.translationId;
  const [__, setHeader] = React.useContext(HeaderContext);
  const [translation, setTranslation] = React.useState<any>(null);
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => {
    setHeader({ title: "Translations" });
  }, [setHeader]);

  React.useEffect(() => {
    translationId && getTranslation();
  }, [API, translationId]);

  const getTranslation = () => {
    API.Translation.getOne(translationId)
      .then((res) => {
        setTranslation(res.data);
      })
      .catch((err) => {
        throw new Error("GET translation error: " + err);
      });
  };

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            {translation && <TranslationTable tableName={translation?.translationTable} />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
