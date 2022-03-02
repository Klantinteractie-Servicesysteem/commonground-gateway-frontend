import { AxiosInstance, AxiosResponse } from "axios";

export default class Subscriber {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getOne = (id: string): Promise<AxiosResponse> => {
    return this._instance.get(`/subscribers/${id}`);
  };

  public create = (data: any): Promise<AxiosResponse> => {
    return this._instance.post("/subscribers", JSON.stringify(data));
  };

  public update = (data: any, id: string): Promise<AxiosResponse> => {
    return this._instance.put(`/subscribers/${id}`, JSON.stringify(data));
  };

  public getAllFromEntity = (entityId: string): Promise<AxiosResponse> => {
    return this._instance.get(`/subscribers?entity.id=${entityId}`);
  };

  public delete = (id: string): Promise<AxiosResponse> => {
    return this._instance.delete(`/subscribers/${id}`)
  }
}
