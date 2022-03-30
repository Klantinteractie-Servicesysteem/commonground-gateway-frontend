import { Send } from "../apiService";
import { AxiosInstance, AxiosResponse } from "axios";

export default class Application {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = (): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", "/applications");
  };

  public getOne = (id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", `/applications/${id}`);
  };

  public createOrUpdate = (data: any, id?: string): Promise<AxiosResponse> => {
    if (id) {
      return Send(this._instance, "PUT", `/applications/${id}`, data);
    }

    return Send(this._instance, "POST", "/applications", data);
  };

  public delete = (variables: { id: string }): Promise<AxiosResponse> => {
    return Send(this._instance, "DELETE", `/applications/${variables.id}`);
  };
}
