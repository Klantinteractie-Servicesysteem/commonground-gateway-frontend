import { AxiosInstance, AxiosResponse } from "axios";

export default class Application {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = (): Promise<AxiosResponse> => {
    return this._instance.get("/applications");
  };

  public getOne = (id: string): Promise<AxiosResponse> => {
    return this._instance.get(`/applications/${id}`);
  };

  public create = (data: any): Promise<AxiosResponse> => {
    return this._instance.post("/applications", JSON.stringify(data));
  };

  public update = (data: any, id: string): Promise<AxiosResponse> => {
    return this._instance.put(`/applications/${id}`, JSON.stringify(data));
  };

  public delete = (id: string): Promise<AxiosResponse> => {
    return this._instance.delete(`/applications/${id}`)
  }
}
