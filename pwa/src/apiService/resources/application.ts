import { AxiosResponse } from "axios";
import { axiosClient } from "./../apiService";

export const getApplications = (): Promise<AxiosResponse> => {
  return axiosClient.get('/applications')
}

export const getApplication = (id: string): Promise<AxiosResponse> => {
  return axiosClient.get(`/applications/${id}`)
}

// TODO: test
// export const addApplication = (data): Promise<AxiosResponse> => {
//   return axios.post('/applications', JSON.stringify(data))
// }
