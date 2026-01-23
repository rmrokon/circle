import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Circle App API Documentation',
            version: '1.0.0',
            description: 'API documentation for the Circle App backend, including Authentication, Users, Staffs, services, and Appointments modules.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/api/modules/**/index.ts', './src/api/modules/**/validations.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default function swaggerLoader(app: Express) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Also expose the swagger spec as JSON
    app.get('/docs-json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}
