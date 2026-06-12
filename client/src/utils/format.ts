import { API_ORIGIN } from '../api/axios';

export const formatPrice = (
  value: number | string
) => {
  return new Intl.NumberFormat(
    'th-TH',
    {
      style: 'currency',
      currency: 'THB',
    }
  ).format(Number(value));
};

export const formatDate = (
  value: string
) => {
  return new Intl.DateTimeFormat(
    'th-TH',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    }
  ).format(new Date(value));
};

export const getImageUrl = (
  image?: string | null
) => {
  if (!image) {
    return '';
  }

  if (
    image.startsWith('http://') ||
    image.startsWith('https://')
  ) {
    return image;
  }

  return `${API_ORIGIN}${
    image.startsWith('/')
      ? image
      : `/${image}`
  }`;
};
