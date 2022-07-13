import { User } from '@prom-cms/shared';
import { ApiClientBase } from '../ApiClientBase';

export class ProfileApiClient extends ApiClientBase {
  update(payload: Partial<User>) {
    return this.axios.post('/api/profile/update', {
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
