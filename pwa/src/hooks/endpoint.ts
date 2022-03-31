import * as React from "react";
import { Dispatch, SetStateAction } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { AlertContext } from "../context/alertContext";
import { navigate } from "gatsby-link";

export const useEndpoint = (queryClient: QueryClient) => {
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);

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

  const remove = (setLoadingOverlay: Dispatch<SetStateAction<boolean>>) =>
    useMutation<any, Error, any>(API.Endpoint.delete, {
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

  const createOrEdit = (setLoadingOverlay: Dispatch<SetStateAction<boolean>>, endpointId?: string) =>
    useMutation<any, Error, any>(API.Endpoint.createOrUpdate, {
      onMutate: () => {
        setLoadingOverlay(true);
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
        setLoadingOverlay(false);
      },
    });

  return { getOne, getAll, remove, createOrEdit };
};
