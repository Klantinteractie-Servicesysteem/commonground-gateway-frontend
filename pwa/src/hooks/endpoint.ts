import * as React from "react";
import { Dispatch, SetStateAction } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { AlertContext } from "../context/alertContext";

export const useEndpoint = (queryClient: QueryClient, setLoadingOverlay?: Dispatch<SetStateAction<boolean>>) => {
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);

  const getEndpoints = useQuery<any[], Error>("endpoints", API.Endpoint.getAll, {
    onError: (error) => {
      setAlert({ message: error.message, type: "danger" });
    },
  });

  const deleteEndpoint = useMutation<any, Error, any>(API.Endpoint.delete, {
    onMutate: () => {
      setLoadingOverlay(true);
    },
    onError: (error) => {
      setAlert({ message: error.message, type: "danger" });
    },
    onSuccess: async (_, variables) => {
      const previousEndpoints = queryClient.getQueryData<any[]>("endpoints");
      await queryClient.cancelQueries("endpoints");

      const newEndpoints = previousEndpoints.filter((endpoint) => endpoint.id !== variables.id);
      queryClient.setQueryData("endpoints", [...newEndpoints]);

      queryClient.invalidateQueries("endpoints");
      setAlert({ message: "Deleted endpoint", type: "success" });
    },
    onSettled: () => {
      setLoadingOverlay(false);
    },
  });

  return { getEndpoints, deleteEndpoint };
};
