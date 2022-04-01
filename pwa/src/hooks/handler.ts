import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { AlertContext } from "../context/alertContext";
import { LoadingOverlayContext } from "../context/loadingOverlayContext";
import { navigate } from "gatsby-link";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";

export const useHandler = (queryClient: QueryClient) => {
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const getOne = (handlerId: string) =>
    useQuery<any, Error>(["handlers", handlerId], () => API.Handler.getOne(handlerId), {
      initialData: () => queryClient.getQueryData<any[]>("handlers")?.find((handler) => handler.id === handlerId),
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!handlerId,
    });

  const getAllFromEndpoint = (handlerId: string) =>
    useQuery<any[], Error>("handlers", () => API.Handler.getAllFromEndpoint(handlerId), {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Handler.delete, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "handlers", variables.id);
        setAlert({ message: "Deleted handler", type: "success" });
      },
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      onSettled: () => {
        setLoadingOverlay({ isLoading: false });
      },
    });

  const createOrEdit = (endpointId: string, handlerId?: string) =>
    useMutation<any, Error, any>(API.Handler.createOrUpdate, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (newHandler) => {
        if (handlerId) {
          updateItem(queryClient, "handlers", newHandler);
          setAlert({ message: "Updated handler", type: "success" });
          navigate(`/endpoints/${endpointId}/handlers`);
        }

        if (!handlerId) {
          addItem(queryClient, "handlers", newHandler);
          setAlert({ message: "Created handler", type: "success" });
          navigate(`/endpoints/${endpointId}/handlers/${newHandler.id}`);
        }
      },
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      onSettled: () => {
        setLoadingOverlay({ isLoading: false });
      },
    });

  return { getOne, getAllFromEndpoint, remove, createOrEdit };
};
