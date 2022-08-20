import { User } from '@prom-cms/shared';
import { Response } from "../../types";
import { ApiClientBase } from '../ApiClientBase';

export class ProfileApiClient extends ApiClientBase {
  update(payload: Partial<Omit<User, "id">>) {
    return this.axios.post<Response<User>>('/api/profile/update', {
      data: payload,
    });
  }

  resetPassword(payload: { email: string }) {
    return this.axios.get('/api/profile/request-password-reset', {
      params: payload,
    });
  }

  finalizePasswordReset(payload: { new_password: string; token: string }) {
    return this.axios.post('/api/profile/finalize-password-reset', payload);
  }
}
