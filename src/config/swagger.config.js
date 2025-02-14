const swaggerJsDocks = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
function SwaggerConfig(app) {
  const swaggerDocument = swaggerJsDocks({
    swaggerDefinition: {
      openapi: "3.0.1",
      info: {
        title: "divar-backend",
        description: "13awmir",
        version: "1.0.0",
      },
    },
    apis: [process.cwd() + "/src/modules/**/*.swagger.js"],
  });
  const swagger = swaggerUi.setup(swaggerDocument, {});
  app.use("/swagger", swaggerUi.serve, swagger);
}

module.exports = SwaggerConfig;
