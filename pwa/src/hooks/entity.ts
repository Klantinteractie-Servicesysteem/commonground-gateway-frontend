import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { AlertContext } from "../context/alertContext";
import { LoadingOverlayContext } from "../context/loadingOverlayContext";
import { navigate } from "gatsby-link";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";

export const useEntity = (queryClient: QueryClient) => {
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const getOne = (entityId: string) =>
    useQuery<any, Error>(["entities", entityId], () => API.Entity.getOne(entityId), {
      initialData: () => queryClient.getQueryData<any[]>("entities")?.find((entity) => entity.id === entityId),
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!entityId,
    });

  const getAll = () =>
    useQuery<any[], Error>("entities", API.Entity.getAll, {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
    });

  const getSelect = () =>
    useQuery<any[], Error>("entities-select", API.Entity.getSelect, {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Entity.delete, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "entities", variables.id);
        setAlert({ message: "Deleted object type", type: "success" });
      },
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      onSettled: () => {
        setLoadingOverlay({ isLoading: false });
      },
    });

  const createOrEdit = (entityId?: string) =>
    useMutation<any, Error, any>(API.Entity.createOrUpdate, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (newEntity) => {
        if (entityId) {
          updateItem(queryClient, "entities", newEntity);
          setAlert({ message: "Updated object type", type: "success" });
          navigate("/entities");
        }

        if (!entityId) {
          addItem(queryClient, "entities", newEntity);
          setAlert({ message: "Created object type", type: "success" });
          navigate(`/entities/${newEntity.id}`);
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
