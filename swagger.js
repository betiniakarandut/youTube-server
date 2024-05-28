import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'YouTube Server API',
    version: '1.0.0',
    description: 'API documentation for YouTube Server',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server'
    },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        required: ['username', 'email', 'phone', 'password'],
        properties: {
          username: {
            type: 'string',
            description: 'Username',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'The user\'s email',
          },
          phone: {
            type: 'integer',
            description: 'The user\'s mobile number',
          },
          password: {
            type: 'string',
            description: 'The user\'s password',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      userOTPVerification: {
        type: 'object',
        required: ['userId', 'otp'],
        properties: {
          userId: {
            type: 'string',
            description: 'User ID',
          },
          otp: {
            type: 'string',
            description: 'OTP received by user',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Video: {
        type: 'object',
        required: ['title', 'description', 'filepath', 'category'],
        properties: {
          title: {
            type: 'string',
            description: 'Video title',
          },
          description: {
            type: 'string',
            description: 'Video description',
          },
          file: {
            type: 'string',
            description: 'Video path',
          },
          category: {
            type: 'string',
            description: 'Video category',
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ['./routes/*.js'],
}

const swaggerSpec = swaggerJSDoc(options);

const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerSetup;