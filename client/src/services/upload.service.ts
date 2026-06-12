import api from '../api/axios';

export const uploadProductImage =
  async (
    file: File
  ): Promise<string> => {
    const formData =
      new FormData();

    formData.append(
      'image',
      file
    );

    const response =
      await api.post(
        '/upload/product',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

    return response.data.imageUrl;
  };
