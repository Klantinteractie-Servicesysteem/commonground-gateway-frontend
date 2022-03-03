import { AxiosInstance, AxiosResponse } from "axios"

export default class FormIO {
  private _instance: AxiosInstance

  constructor (_instance: AxiosInstance) {
    this._instance = _instance
  }

  public getSchema = (endpoint: string): Promise<AxiosResponse> => {
    return this._instance.get(`/${endpoint}`);
  }
}
