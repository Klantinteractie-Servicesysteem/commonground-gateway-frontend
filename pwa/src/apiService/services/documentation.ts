import { AxiosInstance, AxiosResponse } from "axios";

export default class Documentation {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  // section not via /# , but %23??
  // tijdelijke feature branch: https://modal-gateway.readthedocs.io/en/latest/sources/
  // nieuw: https://common-ground-documentation.readthedocs.io/en/latest/
  // oud: https://commonground-gateway.readthedocs.io/en/latest/features/%23sources
  public get = (path: string): Promise<AxiosResponse> => {
    return this._instance.get(
      `?url=https://modal-gateway.readthedocs.io/en/latest/${path}/`
    );
  };
}
