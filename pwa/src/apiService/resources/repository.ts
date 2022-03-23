import { Send } from "../apiService";
import { AxiosInstance } from "axios";
import { resourceArrayToSelectArray } from "../../services/resourceArrayToSelectArray";

export default class Repository {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/publiccode");
    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/publiccode/github/${id}`);

    data.applications = resourceArrayToSelectArray(data.applications, "applications");
    data.endpoints = resourceArrayToSelectArray(data.endpoints, "endpoints");
    data.entities = resourceArrayToSelectArray(data.entities, "entities");

    return data;
  };

  public install = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/publiccode/github/install/${id}`);

    return data;
  };

}
