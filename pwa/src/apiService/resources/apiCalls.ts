import { Send } from "../apiService";
import { AxiosInstance, AxiosResponse } from "axios";

export default class FormIO {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public createObject = (endpoint: string, data: any): Promise<AxiosResponse> => {
    return Send(this._instance, "POST", `/${endpoint}`, data);
  };

  public updateObject = (endpoint: string, id: string, data: any): Promise<AxiosResponse> => {
    return Send(this._instance, "PUT", `/${endpoint}/${id}`, data);
  };

  public getOne = (endpoint: string, id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", `/${endpoint}/${id}`);
  };
}
