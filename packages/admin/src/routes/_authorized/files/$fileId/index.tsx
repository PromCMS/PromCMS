import { apiClient } from '@api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authorized/files/$fileId/')({
  async loader({ params }) {
    return apiClient.library.files
      .getOne(params.fileId)
      .then(({ data }) => data.data);
  },
});

export const FileUnderpageRoute = Route;
