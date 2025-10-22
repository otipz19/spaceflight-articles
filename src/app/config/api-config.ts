import {ApiModule, Configuration} from "../api";
import {importProvidersFrom} from "@angular/core";

export class ApiConfig extends Configuration {
  constructor() {
    super({
      basePath: 'https://api.spaceflightnewsapi.net',
    });
  }
}

export const apiConfigProvider = importProvidersFrom(
  ApiModule.forRoot(() => new ApiConfig())
)
