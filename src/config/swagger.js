import swaggerJSDoc from 'swagger-jsdoc';

// Swagger definition
const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        tags: [
            {
                name: 'Dishes',
                description: 'API for dishes in the system'
            },
            {
                name: 'Categories',
                description: 'API for categories in the system'
            },
            {
                name: 'Users',
                description: 'API for users in the system'
            },
            {
                name: 'Auth',
                description: 'API for authentication in the system'
            },
            {
                name: 'Orders',
                description: 'API for orders in the system'
            },
            {
                name: 'Roles',
                description: 'API for roles in the system'
            }

        ],
        info: {
            title: 'Restaurant API',
            version: '1.0.0',
            description: 'API for restaurant management system'
        }
    },
    apis: ['./src/routes/*.js']
}
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;