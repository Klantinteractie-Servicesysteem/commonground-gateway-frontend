import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { AlertContext } from "../context/alertContext";
import { LoadingOverlayContext } from "../context/loadingOverlayContext";
import { navigate } from "gatsby-link";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";

export const useApplication = (queryClient: QueryClient) => {
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const getOne = (applicationId: string) =>
    useQuery<any, Error>(["applications", applicationId], () => API.Application.getOne(applicationId), {
      initialData: () =>
        queryClient.getQueryData<any[]>("applications")?.find((application) => application.id === applicationId),
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!applicationId,
    });

  const getAll = () =>
    useQuery<any[], Error>("applications", API.Application.getAll, {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
    });

  const getSelect = () =>
    useQuery<any[], Error>("applications-select", API.Application.getSelect, {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Application.delete, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "applications", variables.id);
        setAlert({ message: "Deleted application", type: "success" });
      },
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      onSettled: () => {
        setLoadingOverlay({ isLoading: false });
      },
    });

  const createOrEdit = (applicationId?: string) =>
    useMutation<any, Error, any>(API.Application.createOrUpdate, {
      onMutate: () => {
        setLoadingOverlay({ isLoading: true });
      },
      onSuccess: async (newApplication) => {
        if (applicationId) {
          updateItem(queryClient, "applications", newApplication);
          setAlert({ message: "Updated application", type: "success" });
          navigate("/applications");
        }

        if (!applicationId) {
          addItem(queryClient, "applications", newApplication);
          setAlert({ message: "Created application", type: "success" });
          navigate(`/applications/${newApplication.id}`);
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
