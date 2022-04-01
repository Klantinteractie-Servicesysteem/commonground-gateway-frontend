import { QueryClient } from "react-query";

const addItem = async (queryClient: QueryClient, queryKey: string, item: any) => {
  await queryClient.cancelQueries(queryKey);

  const previousQueryData = queryClient.getQueryData<any[]>(queryKey);

  if (previousQueryData) {
    queryClient.setQueryData(queryKey, [item, ...previousQueryData]);
  }

  queryClient.invalidateQueries(queryKey);
};

const updateItem = async (queryClient: QueryClient, queryKey: string, item: any) => {
  await queryClient.cancelQueries(queryKey);

  const previousQueryData = queryClient.getQueryData<any[]>(queryKey);

  if (previousQueryData) {
    const index = previousQueryData.findIndex((previousItem) => previousItem.id === item.id);

    previousQueryData[index] = item;

    queryClient.setQueryData(queryKey, previousQueryData);
  }

  queryClient.invalidateQueries(queryKey);
};

const deleteItem = async (queryClient: QueryClient, queryKey: string, itemId: any) => {
  const previousEndpoints = queryClient.getQueryData<any[]>("endpoints");
  await queryClient.cancelQueries("endpoints");

  const newEndpoints = previousEndpoints.filter((endpoint) => endpoint.id !== itemId);
  queryClient.setQueryData("endpoints", [...newEndpoints]);

  queryClient.invalidateQueries("endpoints");
};

export { addItem, updateItem, deleteItem };
