import * as React from "react";
import CollectionTable from "../../components/collections/collectionTable";
import { Card } from "@conductionnl/nl-design-system/lib";
import { render } from "react-dom";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { useMutation, useQuery, useQueryClient } from "react-query";

const IndexPage = () => {
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  const queryClient = useQueryClient();

  const getRepositoriesQuery = useQuery<any[], Error>("repositories", API.Repository.getAll, {
    onError: (error) => {
      setAlert({ message: error.message, type: "danger" });
    },
  });


    console.log(getRepositoriesQuery.data)

  return (
    <main>
      <div className="row">
        <div className="col-6">

        </div>
        <div className="col-6">
          <div className="page-top-item">
            <Card cardBody={function () {
              return (
                <p>hi</p>
              )}} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
