import { AxiosInstance, AxiosResponse } from "axios";

export default class Entity {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = (): Promise<AxiosResponse> => {
    return this._instance.get("/entities");
  };

  public getOne = (id: string): Promise<AxiosResponse> => {
    return this._instance.get(`/entities/${id}`);
  };

  public create = (data: any): Promise<AxiosResponse> => {
    return this._instance.post("/entities", JSON.stringify(data));
  };

  public update = (data: any, id: string): Promise<AxiosResponse> => {
    return this._instance.put(`/entities/${id}`, JSON.stringify(data));
  };
}
