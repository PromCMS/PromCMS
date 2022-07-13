import { apiClient } from '@api';
import { User } from '@prom-cms/shared';

export class ProfileService {
  static ME_API_URL = '/profile/me';
  static API_LOGIN_URL = '/profile/login';
  static API_LOGOUT_URL = '/profile/logout';
  static API_REQUEST_PASSWORD_RESET_URL = '/profile/request-password-reset';
  static API_FINALIZE_PASSWORD_RESET_URL = '/profile/finalize-password-reset';
  static API_UPDATE_URL = '/profile/update';

  static login(payload: { password: string; email: string }) {
    return apiClient.post(this.API_LOGIN_URL, payload);
  }

  static requestPasswordReset(payload: { email: string }) {
    return apiClient.get(this.API_REQUEST_PASSWORD_RESET_URL, {
      params: payload,
    });
  }

  static finalizePasswordReset(payload: {
    new_password: string;
    token: string;
  }) {
    return apiClient.post(this.API_FINALIZE_PASSWORD_RESET_URL, payload);
  }

  static save(payload: User) {
    return apiClient.post(this.API_UPDATE_URL, {
      data: payload,
    });
  }
}
