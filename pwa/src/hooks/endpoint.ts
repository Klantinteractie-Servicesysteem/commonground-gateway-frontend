import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { AlertContext } from "../context/alertContext";
import { LoadingOverlayContext } from "../context/loadingOverlayContext";
import { navigate } from "gatsby-link";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";

export const useEndpoint = (queryClient: QueryClient) => {
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const getOne = (endpointId: string) =>
    useQuery<any, Error>(["endpoints", endpointId], () => API.Endpoint.getOne(endpointId), {
      initialData: () => queryClient.getQueryData<any[]>("endpoints")?.find((endpoint) => endpoint.id === endpointId),
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!endpointId,
    });

  const getAll = () =>
    useQuery<any[], Error>("endpoints", API.Endpoint.getAll, {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
    });

  const getSelect = () =>
    useQuery<any[], Error>("endpoints-select", API.Endpoint.getSelect, {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Endpoint.delete, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "endpoints", variables.id);
        setAlert({ message: "Deleted endpoint", type: "success" });
      },
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      onSettled: () => {
        setLoadingOverlay({ isLoading: false });
      },
    });

  const createOrEdit = (endpointId?: string) =>
    useMutation<any, Error, any>(API.Endpoint.createOrUpdate, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (newEndpoint) => {
        if (endpointId) {
          updateItem(queryClient, "endpoints", newEndpoint);
          setAlert({ message: "Updated endpoint", type: "success" });
          navigate("/endpoints");
        }

        if (!endpointId) {
          addItem(queryClient, "endpoints", newEndpoint);
          setAlert({ message: "Created endpoint", type: "success" });
          navigate(`/endpoints/${newEndpoint.id}`);
        }
      },
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      onSettled: () => {
        setLoadingOverlay({ isLoading: false });
      },
    });

  return { getOne, getAll, getSelect, remove, createOrEdit };
};
