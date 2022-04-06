import axios, { AxiosInstance, AxiosResponse } from "axios";
import Application from "./resources/application";
import Attribute from "./resources/attribute";
import Source from "./resources/source";
import Entity from "./resources/entity";
import ObjectEntity from "./resources/ObjectEntity";
import Log from "./resources/log";
import Login from "./services/login";
import Documentation from "./services/documentation";
import Endpoint from "./resources/endpoint";
import Translation from "./resources/translation";
import FormIO from "./resources/formIO";
import Test from "./resources/test";
import Handler from "./resources/handler";
import ApiCalls from "./resources/apiCalls";
import Subscriber from "./resources/subscriber";
import Collection from "./resources/collection";
import Package from "./resources/package";
import { isLoggedIn, logout, validateSession } from "../services/auth";

export default class APIService {
  private _jwtToken: string;

  constructor(_jwtToken: string) {
    this._jwtToken = _jwtToken;
  }

  // Clients
  public get adminClient(): AxiosInstance {
    return axios.create({
      baseURL: window.GATSBY_ADMIN_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this._jwtToken,
      },
    });
  }

  public get apiClient(): AxiosInstance {
    return axios.create({
      baseURL: window.GATSBY_API_URL,
      headers: {
        Accept: "application/form.io",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this._jwtToken,
      },
    });
  }

  public get loginClient(): AxiosInstance {
    return axios.create({
      baseURL: window.GATSBY_API_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  public get documentationClient(): AxiosInstance {
    return axios.create({
      baseURL: process.env.GATSBY_READ_THE_DOCS_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  public get formIOClient(): AxiosInstance {
    return axios.create({
      baseURL: window.GATSBY_API_URL,
      headers: {
        Accept: "application/form.io",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this._jwtToken,
      },
    });
  }

  // Resources
  public get Application(): Application {
    return new Application(this.adminClient);
  }

  public get Attribute(): Attribute {
    return new Attribute(this.adminClient);
  }

  public get Source(): Source {
    return new Source(this.adminClient);
  }

  public get Entity(): Entity {
    return new Entity(this.adminClient);
  }

  public get ObjectEntity(): ObjectEntity {
    return new ObjectEntity(this.adminClient);
  }

  public get Log(): Log {
    return new Log(this.adminClient);
  }

  public get Endpoint(): Endpoint {
    return new Endpoint(this.adminClient);
  }

  public get Translation(): Translation {
    return new Translation(this.adminClient);
  }

  public get Handler(): Handler {
    return new Handler(this.adminClient);
  }

  public get Subscriber(): Subscriber {
    return new Subscriber(this.adminClient);
  }

  public get Collection(): Collection {
    return new Collection(this.adminClient);
  }

  public get Package(): Package {
    return new Package(this.adminClient);
  }


  public get Test(): Test {
    return new Test(this.apiClient);
  }

  public get FormIO(): FormIO {
    return new FormIO(this.formIOClient);
  }

  // Services
  public get Login(): Login {
    return new Login(this.loginClient);
  }

  public get Documentation(): Documentation {
    return new Documentation(this.documentationClient);
  }

  public get ApiCalls(): ApiCalls {
    return new ApiCalls(this.apiClient);
  }
}

export const Send = (
  instance: AxiosInstance,
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  payload?: JSON,
): Promise<AxiosResponse> => {
  const _payload = JSON.stringify(payload);

  if (!validateSession()) {
    logout();

    return Promise.resolve({
      // return fake AxiosInstance for calls to not break
      data: [],
      status: -1,
      statusText: "Session invalid",
      config: {},
      headers: {},
    });
  }

  switch (method) {
    case "GET":
      return instance.get(endpoint);
    case "POST":
      return instance.post(endpoint, _payload);
    case "PUT":
      return instance.put(endpoint, _payload);
    case "DELETE":
      return instance.delete(endpoint);
  }
};
