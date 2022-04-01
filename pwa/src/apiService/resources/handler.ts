import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Handler {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/handlers/${id}`);

    return data;
  };

  public getAllFromEndpoint = async (endpointId: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/handlers?endpoints.id=${endpointId}`);

    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/handlers/${id}`, payload);
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/handlers", payload);
    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { data } = await Send(this._instance, "DELETE", `/handlers/${variables.id}`);
    return data;
  };
}
