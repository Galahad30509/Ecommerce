const swaggerDocument = {
  openapi: '3.0.0',

  info: {
    title: 'Ecommerce API',
    version: '1.0.0',
  },

  servers: [
    {
      url:
        'http://localhost:5000/api',
    },
  ],
};

export default swaggerDocument;