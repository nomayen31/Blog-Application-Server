import swaggerJSDoc from "swagger-jsdoc";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Blog API Documentation",
            version: "1.0.0",
            description: "API documentation for the Blog Application",
            contact: {
                name: "API Support",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local Development Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                Post: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440000" },
                        title: { type: "string", example: "Getting Started with Prisma" },
                        content: { type: "string", example: "Prisma is a modern DB toolkit..." },
                        isFeatured: { type: "boolean", example: false },
                        status: { type: "string", enum: ["DRAFT", "PUBLISHED", "ARCHIVED"], example: "PUBLISHED" },
                        authorID: { type: "string", example: "user-123" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
            },
        },
    },
    apis: ["./src/modules/**/*.router.ts", "./src/app.ts"], // Path to the API docs
};
export const swaggerSpec = swaggerJSDoc(options);
//# sourceMappingURL=swagger.js.map