import { Axios } from 'axios';

export class ApiClientBase {
  axios: Axios;

  constructor(axiosClient: Axios) {
    this.axios = axiosClient;
  }
}
