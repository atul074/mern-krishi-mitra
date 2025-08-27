import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const setupSwagger = (app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: { title: "Admin Service API", version: "1.0.0" },
    },
    apis: ["./routes/**/*.js"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
