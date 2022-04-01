import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { AlertContext } from "../context/alertContext";
import { LoadingOverlayContext } from "../context/loadingOverlayContext";
import { navigate } from "gatsby-link";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";

export const useSubscriber = (queryClient: QueryClient) => {
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const getOne = (subscriberId: string) =>
    useQuery<any, Error>(["subscribers", subscriberId], () => API.Subscriber.getOne(subscriberId), {
      initialData: () =>
        queryClient.getQueryData<any[]>("subscribers")?.find((subscriber) => subscriber.id === subscriberId),
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!subscriberId,
    });

  const getAllFromEntity = (entityId: string) =>
    useQuery<any[], Error>("subscribers", () => API.Subscriber.getAllFromEntity(entityId), {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Subscriber.delete, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "subscribers", variables.id);
        setAlert({ message: "Deleted subscriber", type: "success" });
      },
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      onSettled: () => {
        setLoadingOverlay({ isLoading: false });
      },
    });

  const createOrEdit = (entityId: string, subscriberId?: string) =>
    useMutation<any, Error, any>(API.Subscriber.createOrUpdate, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (newSubscriber) => {
        if (subscriberId) {
          updateItem(queryClient, "subscribers", newSubscriber);
          setAlert({ message: "Updated subscriber", type: "success" });
          navigate(`/entities/${entityId}`, {
            state: { activeTab: "subscribers" },
          });
        }

        if (!subscriberId) {
          addItem(queryClient, "subscribers", newSubscriber);
          setAlert({ message: "Created subscriber", type: "success" });
          navigate(`/entities/${entityId}/subscribers/${newSubscriber.id}`);
        }
      },
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      onSettled: () => {
        setLoadingOverlay({ isLoading: false });
      },
    });

  return { getOne, getAllFromEntity, remove, createOrEdit };
};
