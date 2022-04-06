import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { AlertContext } from "../context/alertContext";
import { navigate } from "gatsby-link";
import { LoadingOverlayContext } from "../context/loadingOverlayContext";

export const useRepository = (queryClient: QueryClient) => {
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const getOne = (repositoryId: string) =>
    useQuery<any, Error>(["repositories", repositoryId], () => API.Repository.getOne(repositoryId), {
      retry: false,
      retryOnMount: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      cacheTime: 3600000,
      staleTime: 3600000,
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!repositoryId,
    });

  const getAll = () =>
    useQuery<any[], Error>("repositories", API.Repository.getAll, {
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

  const install = (repositoryId: string) =>
    useMutation<any, Error, any>(["repositories", repositoryId], () => API.Repository.install(repositoryId), {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (_) => {
        setAlert({ message: "Installed repository", type: "success" });
        navigate("/collections");
      },
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      onSettled: () => {
        setLoadingOverlay({ isLoading: false });
      }
    });

  return { getOne, getAll, install};
};
