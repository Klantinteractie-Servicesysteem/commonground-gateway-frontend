import { Send } from "../apiService";
import { AxiosInstance } from "axios";
import { resourceArrayToSelectArray } from "../../services/resourceArrayToSelectArray";

export default class Application {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/applications");
    return data;
  };

  public getSelect = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/applications");

    return resourceArrayToSelectArray(data, "applications");
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/applications/${id}`);
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id: string }): Promise<any> => {
    const { payload, id } = variables;
    if (id) {
      const { data } = await Send(this._instance, "PUT", `/applications/${id}`, payload);
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/applications", payload);
    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/applications/${id}`);
    return data;
  };
}
