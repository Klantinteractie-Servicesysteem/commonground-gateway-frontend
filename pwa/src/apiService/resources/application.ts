import { AxiosResponse } from "axios";
import { axiosClient } from "./../apiService";

export const getApplications = (): Promise<AxiosResponse> => {
  return axiosClient.get('/applications')
}

export const getApplication = (id: string): Promise<AxiosResponse> => {
  return axiosClient.get(`/applications/${id}`)
}

export const createApplication = (data: any): Promise<AxiosResponse> => {
  return axiosClient.post('/applications', JSON.stringify(data))
}

export const updateApplication = (data: any, id: string): Promise<AxiosResponse> => {
  return axiosClient.put(`/applications/${id}`, JSON.stringify(data))
}
