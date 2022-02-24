import { AxiosInstance, AxiosResponse } from "axios";

export default class Translation {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAllWithTableName = (tableName: string): Promise<AxiosResponse> => {
    return this._instance.get(`/translations?translationTable=${tableName}`);
  };

  public getAllTableNames = (): Promise<AxiosResponse> => {
    return this._instance.get("/table_names");
  };

  public create = (data: any): Promise<AxiosResponse> => {
    return this._instance.post("/translations", JSON.stringify(data));
  };

  public update = (data: any, id: string): Promise<AxiosResponse> => {
    return this._instance.put(`/translations/${id}`, JSON.stringify(data));
  };

  public delete = (id: string): Promise<AxiosResponse> => {
    return this._instance.delete(`/translations/${id}`)
  }
}
