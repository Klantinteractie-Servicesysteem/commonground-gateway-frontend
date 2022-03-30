import { Send } from "../apiService";
import { AxiosInstance, AxiosResponse } from "axios";

export default class Source {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = (): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", "/gateways");
  };

  public getOne = (id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", `/gateways/${id}`);
  };

  public createOrUpdate = (data: any, id?: string): Promise<AxiosResponse> => {
    if (id) {
      return Send(this._instance, "PUT", `/gateways/${id}`, data);
    }

    return Send(this._instance, "POST", "/gateways", data);
  };

  public delete = (variables: { id: string }): Promise<AxiosResponse> => {
    return Send(this._instance, "DELETE", `/gateways/${variables.id}`);
  };
}
