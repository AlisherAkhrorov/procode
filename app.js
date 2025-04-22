require("dotenv").config();
const fastify = require("fastify");
const cors = require("@fastify/cors");
const routes = require("./routers/router.js");

// Создаем экземпляр Fastify
const app = fastify({
  logger: true,
  requestTimeout: 30000, // таймаут 30 сек
  bodyLimit: 1048576, // 1MB лимит для body
});

// Глобальная обработка ошибок
app.setErrorHandler((error, request, reply) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  
  request.log.error(error);
  
  reply.status(statusCode).send({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
});

// Регистрируем плагины
async function registerPlugins() {
  // CORS
  await app.register(cors, {
    origin: true
  });

  // Регистрируем все маршруты
  app.register(routes);
}

// Обработка необработанных исключений
process.on("uncaughtException", (err) => {
  app.log.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  app.log.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Запуск сервера
const PORT = process.env.PORT || 4000;
const startServer = async () => {
  try {
    await registerPlugins();
    await app.listen({ port: PORT, host: '0.0.0.0' });
    app.log.info(`Server listening on port ${PORT}`);
  } catch (error) {
    app.log.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
