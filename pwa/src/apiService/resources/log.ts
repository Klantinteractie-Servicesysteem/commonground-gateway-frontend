import { AxiosInstance, AxiosResponse } from "axios"

export default class Log {
  private _instance: AxiosInstance

  constructor (_instance: AxiosInstance) {
    this._instance = _instance
  }

  public getAll = (): Promise<AxiosResponse> => {
    return this._instance.get('/logs')
  }

  public getAllFromEntity = (entityId: string): Promise<AxiosResponse> => {
    return this._instance.get('/logs?entity.id=' + entityId)
  }

  public getAllFromSource = (sourceId: string): Promise<AxiosResponse> => {
    return this._instance.get('/logs?source.id=' + sourceId)
  }
}
