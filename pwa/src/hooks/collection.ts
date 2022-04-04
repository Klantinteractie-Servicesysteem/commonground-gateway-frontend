import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { AlertContext } from "../context/alertContext";
import { LoadingOverlayContext } from "../context/loadingOverlayContext";
import { navigate } from "gatsby-link";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";

export const useCollection = (queryClient: QueryClient) => {
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const getOne = (collectionId: string) =>
    useQuery<any, Error>(["collections", collectionId], () => API.Collection.getOne(collectionId), {
      initialData: () => queryClient.getQueryData<any[]>("collections")?.find((collection) => collection.id === collectionId),
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!collectionId,
    });

  const getAll = () =>
    useQuery<any[], Error>("collections", () => API.Collection.getAll(), {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Collection.delete, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "collections", variables.id);
        setAlert({ message: "Deleted collection", type: "success" });
      },
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      onSettled: () => {
        setLoadingOverlay({ isLoading: false });
      },
    });

  const createOrEdit = (collectionId?: string) =>
    useMutation<any, Error, any>(API.Collection.createOrUpdate, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (newCollection) => {
        if (collectionId) {
          updateItem(queryClient, "collections", newCollection);
          setAlert({ message: "Updated collection", type: "success" });
          navigate("/collections");
        }

        if (!collectionId) {
          addItem(queryClient, "collections", newCollection);
          setAlert({ message: "Created collection", type: "success" });
          navigate(`/collections/${newCollection.id}`);
        }
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
