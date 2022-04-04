import { Send } from "../apiService";
import { AxiosInstance } from "axios";
import { resourceArrayToSelectArray } from "../../services/resourceArrayToSelectArray";

export default class Entity {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/entities");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/entities/${id}`);

    return data;
  };

  public getSelect = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/entities");

    return resourceArrayToSelectArray(data, "entities");
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { id, payload } = variables;
    if (id) {
      const { data } = await Send(this._instance, "PUT", `/entities/${id}`, payload);
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/entities", payload);
    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/entities/${id}`);

    return data;
  };
}
