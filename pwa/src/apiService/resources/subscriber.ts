import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Subscriber {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/subscribers/${id}`);

    return data;
  };

  public getAllFromEntity = async (entityId: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/subscribers?entity.id=${entityId}`);
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/subscribers/${id}`, payload);
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/subscribers", payload);
    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { data } = await Send(this._instance, "DELETE", `/subscribers/${variables.id}`);
    return data;
  };
}
