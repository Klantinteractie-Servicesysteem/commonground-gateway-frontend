import { AxiosInstance, AxiosResponse } from "axios"

export default class FormIO {
  private _instance: AxiosInstance

  constructor (_instance: AxiosInstance) {
    this._instance = _instance
  }

  public getSchema = (endpoint): Promise<AxiosResponse> => {
    return this._instance.put(`/${endpoint}`);
  }
}
