import { AxiosInstance, AxiosResponse } from "axios"

export default class Source {
  private _instance: AxiosInstance

  constructor (_instance: AxiosInstance) {
    this._instance = _instance
  }

  public getAll = (): Promise<AxiosResponse> => {
    return this._instance.get('/gateways')
  }

  public getOne = (id: string): Promise<AxiosResponse> => {
    return this._instance.get(`/gateways/${id}`)
  }

  public create = (data: any): Promise<AxiosResponse> => {
    return this._instance.post('/gateways', JSON.stringify(data))
  }

  public update = (data: any, id: string): Promise<AxiosResponse> => {
    return this._instance.put(`/gateways/${id}`, JSON.stringify(data))
  }
}
