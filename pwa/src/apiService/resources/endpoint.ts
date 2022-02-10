import { AxiosInstance, AxiosResponse } from "axios"

export default class Endpoint {
  private _instance: AxiosInstance

  constructor (_instance: AxiosInstance) {
    this._instance = _instance
  }

  public getAll = (): Promise<AxiosResponse> => {
    return this._instance.get('/endpoints')
  }

  public getOne = (id: string): Promise<AxiosResponse> => {
    return this._instance.get(`/endpoints/${id}`)
  }

  public create = (data: any): Promise<AxiosResponse> => {
    return this._instance.post('/endpoints', JSON.stringify(data))
  }

  public update = (data: any, id: string): Promise<AxiosResponse> => {
    return this._instance.put(`/endpoints/${id}`, JSON.stringify(data))
  }
}
