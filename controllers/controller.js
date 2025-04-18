const { getProcodeData } = require("../services/procode.service");

/**
 * Валидация входных параметров
 */
function validateParams(params) {
  const { card_num, startDate, endDate } = params;
  const errors = [];

  if (!card_num) {
    errors.push("Номер карты обязателен");
  }

  if (!startDate) {
    errors.push("Начальная дата обязательна");
  } else if (!/^\d{2}-\d{2}-\d{4}$/.test(startDate)) {
    errors.push("Начальная дата должна быть в формате DD-MM-YYYY");
  }

  if (!endDate) {
    errors.push("Конечная дата обязательна");
  } else if (!/^\d{2}-\d{2}-\d{4}$/.test(endDate)) {
    errors.push("Конечная дата должна быть в формате DD-MM-YYYY");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Обработчик запроса на получение процессингового кода
 * Адаптирован для работы с Fastify
 */
async function getProcode(request, reply) {
  const startTime = Date.now();

  try {
    // Получение параметров с поддержкой пагинации
    const { card_num, startDate, endDate } = request.body;
    const page = parseInt(request.query.page || request.body.page || 1, 10);
    const limit = parseInt(
      request.query.limit || request.body.limit || 100,
      10
    );

    // Валидация параметров
    // Fastify автоматически валидирует согласно схеме, но мы оставляем доп. проверки
    const validation = validateParams({ card_num, startDate, endDate });
    if (!validation.isValid) {
      return reply.code(400).send({
        success: false,
        errors: validation.errors,
      });
    }

    // Получение данных из сервиса
    const data = await getProcodeData({
      card_num,
      startDate,
      endDate,
      page,
      limit,
    });

    const executionTime = Date.now() - startTime;
    request.log.info(
      `Запрос выполнен за ${executionTime}мс, получено ${data.rows.length} строк`
    );

    // Отправка успешного ответа с Fastify
    return {
      success: true,
      data,
      executionTime,
    };
  } catch (err) {
    request.log.error("Ошибка выполнения запроса:", err);
    // Передача ошибки обработчику ошибок Fastify
    throw {
      statusCode: 500,
      message: "Ошибка при получении данных",
      originalError: err.message,
    };
  }
}

module.exports = {
  getProcode,
};
