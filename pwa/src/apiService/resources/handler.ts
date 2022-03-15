import { Send } from "../apiService";
import { AxiosInstance, AxiosResponse } from "axios";

export default class Handler {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getOne = (id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", `/handlers/${id}`);
  };

  public createOrUpdate = (data: any, id?: string): Promise<AxiosResponse> => {
    if (id) {
      return Send(this._instance, "PUT", `/handlers/${id}`, data);
    }

    return Send(this._instance, "POST", "/handlers", data);
  };

  public getAllFromEndpoint = (endpointId: string): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", `/handlers?endpoint.id=${endpointId}`);
  };

  public delete = (id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "DELETE", `/handlers/${id}`);
  };
}
