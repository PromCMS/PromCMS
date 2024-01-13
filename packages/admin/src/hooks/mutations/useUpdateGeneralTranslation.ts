import { apiClient } from '@api';
import { useMutation } from '@tanstack/react-query';

export const useUpdateGeneralTranslation = () =>
  useMutation(apiClient.generalTranslations.create);
