import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Repository {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/publiccode");
    return data.items;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/publiccode/github/${id}`);
    return data;
  };

  public install = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/publiccode/github/install/${id}`);
    return data;
  };

}
