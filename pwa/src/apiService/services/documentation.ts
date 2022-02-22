import { AxiosInstance, AxiosResponse } from "axios";

export default class Documentation {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  // section not via /# , but %23??
  public get = (): Promise<AxiosResponse> => {
    return this._instance.get(
      "?url=https://commonground-gateway.readthedocs.io/en/latest/features/%23sources"
    );
  };
}
