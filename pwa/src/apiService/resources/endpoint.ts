import { Send } from "../apiService";
import { AxiosInstance, AxiosResponse } from "axios";

export default class Endpoint {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = (): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", "/endpoints");
  };

  public getOne = (id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", `/endpoints/${id}`);
  };

  public create = (data: any): Promise<AxiosResponse> => {
    return Send(this._instance, "POST", "/endpoints", data);
  };

  public update = (data: any, id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "PUT", `/endpoints/${id}`, data);
  };

  public delete = (id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "DELETE", `/endpoints/${id}`);
  };
}
