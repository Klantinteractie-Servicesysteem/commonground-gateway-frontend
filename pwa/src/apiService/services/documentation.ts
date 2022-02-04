import { AxiosInstance, AxiosResponse } from "axios";

export default class Documentation {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  //add querystring for specific pages.
  public get = (): Promise<AxiosResponse> => {
    return this._instance.get(
      "?url=https://commonground-gateway.readthedocs.io/en/latest/"
    );
  };
}
