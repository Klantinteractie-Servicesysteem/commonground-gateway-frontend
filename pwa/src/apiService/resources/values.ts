import { AxiosInstance, AxiosResponse } from "axios"

export default class Values {
  private _instance: AxiosInstance

  constructor (_instance: AxiosInstance) {
    this._instance = _instance
  }

  public getAll = (): Promise<AxiosResponse> => {
    return this._instance.get(`/values`)
  }

  public getOne = (id: string): Promise<AxiosResponse> => {
    return this._instance.get(`/values/${id}`)
  }

  public create = (data: any): Promise<AxiosResponse> => {
    return this._instance.post('/values', JSON.stringify(data))
  }

  public update = (data: any, id: string): Promise<AxiosResponse> => {
    return this._instance.put(`/values/${id}`, JSON.stringify(data))
  }

  public getAllFromObjectEntity = (objectEntityId: string): Promise<AxiosResponse> => {
    return this._instance.get(`/values?objectEntity.id=${objectEntityId}`)
  }
}
