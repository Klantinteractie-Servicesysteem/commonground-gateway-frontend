import { AxiosInstance, AxiosResponse } from "axios"

export default class FormIO {
  private _instance: AxiosInstance

  constructor (_instance: AxiosInstance) {
    this._instance = _instance
  }
  
  public createObject = (endpoint: string, data: any): Promise<AxiosResponse> => {
    return this._instance.post(`/${endpoint}`, JSON.stringify(data));
  }

  public updateObject = (endpoint: string, id: string, data: any): Promise<AxiosResponse> => {
    return this._instance.put(`/${endpoint}/${id}`, JSON.stringify(data));
  }
}
