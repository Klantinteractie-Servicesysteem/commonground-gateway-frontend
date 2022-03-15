import { Send } from "../apiService";
import { AxiosInstance, AxiosResponse } from "axios";

export default class ObjectEntity {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getOne = (id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", `/object_entities/${id}`);
  };

  public sync = (id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", `/object_entities/${id}/sync`);
  };

  public createOrUpdate = (data: any, id?: string): Promise<AxiosResponse> => {
    if (id) {
      return Send(this._instance, "PUT", `/object_entities/${id}`, data);
    }

    return Send(this._instance, "POST", "/object_entities", data);
  };

  public getAllFromEntity = (entityId: string): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", `/object_entities?entity.id=${entityId}`);
  };

  public delete = (id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "DELETE", `/object_entities/${id}`);
  };
}
