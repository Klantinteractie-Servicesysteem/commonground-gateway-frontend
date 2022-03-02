import { AxiosInstance, AxiosResponse } from "axios";

export default class Documentation {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public get = (path: String): Promise<AxiosResponse> => {
    return this._instance.get(`?url=https://commonground-gateway.readthedocs.io/en/latest/features/${path}/`);
  };
}
