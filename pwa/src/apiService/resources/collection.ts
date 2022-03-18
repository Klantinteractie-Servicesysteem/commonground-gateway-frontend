import { Send } from "../apiService";
import { AxiosInstance, AxiosResponse } from "axios";

export default class Collection {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = (): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", "/collections");
  };

  public getOne = (id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", `/collections/${id}`);
  };

  public createOrUpdate = (data: any, id?: string): Promise<AxiosResponse> => {
    if (id) {
      return Send(this._instance, "PUT", `/collections/${id}`, data);
    }

    return Send(this._instance, "POST", "/collections", data);
  };

  public delete = (variables: { id: string }): Promise<AxiosResponse> => {
    return Send(this._instance, "DELETE", `/collections/${variables.id}`);
  };
}
