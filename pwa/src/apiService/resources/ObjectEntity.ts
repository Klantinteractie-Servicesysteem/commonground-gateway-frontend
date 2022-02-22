import { AxiosInstance, AxiosResponse } from "axios";

export default class ObjectEntity {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getOne = (id: string): Promise<AxiosResponse> => {
    return this._instance.get(`/object_entities/${id}`);
  };

  public create = (data: any): Promise<AxiosResponse> => {
    return this._instance.post("/object_entities", JSON.stringify(data));
  };

  public update = (data: any, id: string): Promise<AxiosResponse> => {
    return this._instance.put(`/object_entities/${id}`, JSON.stringify(data));
  };

  public getAllFromEntity = (entityId: string): Promise<AxiosResponse> => {
    return this._instance.get(`/object_entities?entity.id=${entityId}`);
  };
}
