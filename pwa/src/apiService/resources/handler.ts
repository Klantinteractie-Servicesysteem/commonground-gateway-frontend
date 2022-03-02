import { AxiosInstance, AxiosResponse } from "axios";

export default class Handler {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getOne = (id: string): Promise<AxiosResponse> => {
    return this._instance.get(`/handlers/${id}`);
  };

  public create = (data: any): Promise<AxiosResponse> => {
    return this._instance.post("/handlers", JSON.stringify(data));
  };

  public update = (data: any, id: string): Promise<AxiosResponse> => {
    return this._instance.put(`/handlers/${id}`, JSON.stringify(data));
  };

  public getAllFromEndpoint = (endpointId: string): Promise<AxiosResponse> => {

    return this._instance.get(`/handlers?endpoint.id=${endpointId}`);
  };

  public delete = (id: string): Promise<AxiosResponse> => {
    return this._instance.delete(`/handlers/${id}`);
  };
}
