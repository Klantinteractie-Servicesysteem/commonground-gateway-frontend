import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { AlertContext } from "../context/alertContext";
import { LoadingOverlayContext } from "../context/loadingOverlayContext";
import { navigate } from "gatsby-link";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";

export const usePackage = () => {
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);

  const getOne = (packageName: string) =>
    useQuery<any, Error>(["packages", packageName], () => API.Package.getOne(packageName), {
      retry: false,
      retryOnMount: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      cacheTime: 3600000,
      staleTime: 3600000,
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!packageName,
    });

  const getAll = () =>
    useQuery<any[], Error>("packages", API.Package.getAll, {
      retry: false,
      retryOnMount: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      cacheTime: 3600000,
      staleTime: 3600000,
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
    });

  return { getOne, getAll };
};
