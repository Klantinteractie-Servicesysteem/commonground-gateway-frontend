import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { AlertContext } from "../context/alertContext";
import { LoadingOverlayContext } from "../context/loadingOverlayContext";
import { navigate } from "gatsby-link";

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

  const remove = () =>
    useMutation<any, Error, any>(API.Endpoint.delete, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
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
        setLoadingOverlay({ isLoading: false });
      },
    });

  const createOrEdit = (endpointId?: string) =>
    useMutation<any, Error, any>(API.Endpoint.createOrUpdate, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (newEndpoint) => {
        await queryClient.cancelQueries("endpoints");
        const previousEndpoints = queryClient.getQueryData<any[]>("endpoints");

        if (!previousEndpoints) {
          endpointId && queryClient.setQueryData(["endpoints", endpointId], newEndpoint);
          !endpointId && queryClient.setQueryData(["endpoints", newEndpoint.id], newEndpoint);
        }

        if (previousEndpoints && endpointId) {
          const index = previousEndpoints.findIndex((endpoint) => endpoint.id === endpointId);
          previousEndpoints[index] = newEndpoint;
          queryClient.setQueryData("endpoints", previousEndpoints);
        }

        if (previousEndpoints && !endpointId) {
          queryClient.setQueryData("endpoints", [newEndpoint, ...previousEndpoints]);
        }

        queryClient.invalidateQueries("endpoints");

        setAlert({ message: `${endpointId ? "Updated" : "Created"} endpoint`, type: "success" });
        navigate("/endpoints");
      },
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      onSettled: () => {
        setLoadingOverlay({ isLoading: false });
      },
    });

  return { getOne, getAll, remove, createOrEdit };
};
