import { Send } from "../apiService";
import { AxiosInstance } from "axios";
import { resourceArrayToSelectArray } from "./../../services/resourceArrayToSelectArray";

export default class Package {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/packages");

    return data;
  };

  public getOne = async (name: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/packages/packagist?name=${name}`);

    return data;
  };
}
