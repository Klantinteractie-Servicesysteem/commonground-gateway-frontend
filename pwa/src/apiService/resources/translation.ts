import { AxiosInstance, AxiosResponse } from "axios";
import { Send } from "../apiService";

export default class Translation {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAllFrom = (tableName: string): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", `/translations?translationTable=${tableName}`);
  };

  public getOne = (id: string): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", `/translations/${id}`);
  };

  public createOrUpdate = (data: any, id?: string): Promise<AxiosResponse> => {
    if (id) {
      return Send(this._instance, "PUT", `/translations/${id}`, data);
    }

    return Send(this._instance, "POST", "/translations", data);
  };

  public delete = (variables: { id: string }): Promise<AxiosResponse> => {
    return Send(this._instance, "DELETE", `/translations/${variables.id}`);
  };

  public getTableNames = (): Promise<AxiosResponse> => {
    return Send(this._instance, "GET", "/table_names");
  };
}
