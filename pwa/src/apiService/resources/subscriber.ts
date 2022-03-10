import { Send } from "../apiService";
import { AxiosInstance, AxiosResponse } from "axios";

export default class Subscriber {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getOne = (id: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "GET", `/subscribers/${id}`);
  };

  public create = (data: any): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "POST", "/subscribers", data);
  };

  public update = (data: any, id: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "PUT", `/subscribers/${id}`, data);
  };

  public getAllFromEntity = (entityId: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "GET", `/subscribers?entity.id=${entityId}`);
  };

  public delete = (id: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "DELETE", `/subscribers/${id}`);
  };
}
