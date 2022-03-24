import { Send } from "../apiService";
import { AxiosInstance } from "axios";
import { resourceArrayToSelectArray } from "./../../services/resourceArrayToSelectArray";

export default class Endpoint {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/endpoints");

    const mappedEndpoints = data.map((endpoint) => {
      return { ...endpoint, applications: resourceArrayToSelectArray(endpoint.applications, "applications") };
    });

    return mappedEndpoints;
  };

  public getSelect = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/endpoints");

    const selectData = data.map((endpoint) => {
      return { name: endpoint.name, id: endpoint.name, value: `/admin/endpoints/${endpoint.id}` };
    });

    return selectData;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/endpoints/${id}`);

    data.applications = resourceArrayToSelectArray(data.applications, "applications");

    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/endpoints/${id}`, payload);
      data.applications = resourceArrayToSelectArray(data.applications, "applications");
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/endpoints", payload);
    data.applications = resourceArrayToSelectArray(data.applications, "applications");
    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { data } = await Send(this._instance, "DELETE", `/endpoints/${variables.id}`);
    return data;
  };
}
