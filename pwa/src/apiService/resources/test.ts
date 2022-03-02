import { AxiosInstance, AxiosResponse } from "axios";

export default class Test {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public test = (endpoint: string): Promise<AxiosResponse> => {
    return this._instance.get(endpoint);
  };
}
