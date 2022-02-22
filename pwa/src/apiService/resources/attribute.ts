import { AxiosInstance, AxiosResponse } from "axios";

export default class Entity {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = (): Promise<AxiosResponse> => {
    return this._instance.get("/attributes");
  };

  public getOne = (id: string): Promise<AxiosResponse> => {
    return this._instance.get(`/attributes/${id}`);
  };

  public create = (data: any): Promise<AxiosResponse> => {
    return this._instance.post("/attributes", JSON.stringify(data));
  };

  public update = (data: any, id: string): Promise<AxiosResponse> => {
    return this._instance.put(`/attributes/${id}`, JSON.stringify(data));
  };

  public getAllFromEntity = (entityId: string): Promise<AxiosResponse> => {
    return this._instance.get(`/attributes?entity.id=${entityId}`);
  };
}
