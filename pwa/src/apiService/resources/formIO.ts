import { Send } from "../apiService";
import { AxiosInstance, AxiosResponse } from "axios";

export default class FormIO {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getSchema = (endpoint: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "GET", `/${endpoint}`);
  };
}
