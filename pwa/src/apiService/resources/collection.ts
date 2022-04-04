import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Collection {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/collections");
    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/collections/${id}`);
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;
    if (id) {
      const { data } = await Send(this._instance, "PUT", `/collections/${id}`, payload);
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/collections", payload);
    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { data } = await Send(this._instance, "DELETE", `/collections/${variables.id}`);
    return data;
  };
}
