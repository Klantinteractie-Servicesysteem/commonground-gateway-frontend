import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { AlertContext } from "../context/alertContext";
import { LoadingOverlayContext } from "../context/loadingOverlayContext";
import { navigate } from "gatsby-link";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";

export const useSource = (queryClient: QueryClient) => {
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const getOne = (sourceId: string) =>
    useQuery<any, Error>(["gateways", sourceId], () => API.Source.getOne(sourceId), {
      initialData: () => queryClient.getQueryData<any[]>("gateways")?.find((source) => source.id === sourceId),
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!sourceId,
    });

  const getAll = () =>
    useQuery<any[], Error>("gateways", API.Source.getAll, {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
    });

  const getSelect = () =>
    useQuery<any[], Error>("gateways-select", API.Source.getSelect, {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Source.delete, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "gateways", variables.id);
        setAlert({ message: "Deleted source", type: "success" });
      },
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      onSettled: () => {
        setLoadingOverlay({ isLoading: false });
      },
    });

  const createOrEdit = (sourceId?: string) =>
    useMutation<any, Error, any>(API.Source.createOrUpdate, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (newSource) => {
        if (sourceId) {
          updateItem(queryClient, "gateways", newSource);
          setAlert({ message: "Updated source", type: "success" });
          navigate("/sources");
        }

        if (!sourceId) {
          addItem(queryClient, "gateways", newSource);
          setAlert({ message: "Created source", type: "success" });
          navigate(`/sources/${newSource.id}`);
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
