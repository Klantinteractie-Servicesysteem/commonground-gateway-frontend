import { Send } from "../apiService";
import { AxiosInstance } from "axios";
import { resourceArrayToSelectArray } from "../../services/resourceArrayToSelectArray";

export default class Source {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/gateways");
    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/gateways/${id}`);
    return data;
  };

  public getSelect = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/gateways");

    return resourceArrayToSelectArray(data, "gateways");
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/gateways/${id}`, payload);
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/gateways", payload);
    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/gateways/${id}`);
    return data;
  };
}
