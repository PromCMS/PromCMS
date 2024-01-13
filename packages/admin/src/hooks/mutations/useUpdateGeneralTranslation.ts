import { apiClient } from '@api';
import { useMutation } from '@tanstack/react-query';

export const useUpdateGeneralTranslation = () => {
  return useMutation(apiClient.generalTranslations.createKey);
};
