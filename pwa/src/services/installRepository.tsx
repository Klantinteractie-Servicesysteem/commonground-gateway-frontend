import { useMutation } from "react-query";
import * as React from "react";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { AlertContext } from "../context/alertContext";

const [__, setLoadingOverlay] = React.useState<boolean>(false);
const API: APIService = React.useContext(APIContext);
const [_, setAlert] = React.useContext(AlertContext);

export const installRepository = (repositoryId) => {
  useMutation<any, Error, any>(["repositories", repositoryId], () => API.Repository.install(repositoryId), {
    onMutate: () => {
      setLoadingOverlay(true);
    },
    onError: (error) => {
      setAlert({ message: error.message, type: "danger" });
    },
    onSuccess: async (_) => {
      setAlert({ message: "Installed repository", type: "success" });
    },
    onSettled: () => {
      setLoadingOverlay(false);
    },
  });
};

export default installRepository;
