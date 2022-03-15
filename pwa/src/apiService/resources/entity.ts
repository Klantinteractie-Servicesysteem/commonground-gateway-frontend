import { Send } from "../apiService";
import { AxiosInstance, AxiosResponse } from "axios";

export default class Entity {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = (): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", "/entities");
  };

  public getOne = (id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", `/entities/${id}`);
  };

  public createOrUpdate = (data: any, id?: string): Promise<AxiosResponse> => {
    if (id) {
      return Send(this._instance, "PUT", `/entities/${id}`, data);
    }

    return Send(this._instance, "POST", "/entities", data);
  };

  public delete = (id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "DELETE", `/entities/${id}`);
  };
}
