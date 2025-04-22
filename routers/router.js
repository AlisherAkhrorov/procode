const fp = require('fastify-plugin');
const { getProcode } = require("../controllers/controller");

async function routes(fastify, options) {
  // Схемы для валидации и документирования API
  const procodeSchema = {
    schema: {
      body: {
        type: 'object',
        required: ['card_num', 'startDate', 'endDate'],
        properties: {
          card_num: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          page: { type: 'number' },
          limit: { type: 'number' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { 
              type: 'object',
              properties: {
                rows: { type: 'array' },
                pagination: { 
                  type: 'object',
                  properties: {
                    page: { type: 'number' },
                    limit: { type: 'number' },
                    total: { type: 'number' },
                    totalPages: { type: 'number' }
                  }
                }
              }
            },
            executionTime: { type: 'number' }
          }
        }
      }
    }
  };

  // POST endpoint для получения данных
  fastify.post('/procode', procodeSchema, async (request, reply) => {
    return getProcode(request, reply);
  });

  // GET endpoint для получения данных
  fastify.get('/procode', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          card_num: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          page: { type: 'number' },
          limit: { type: 'number' }
        },
        required: ['card_num', 'startDate', 'endDate']
      }
    }
  }, async (request, reply) => {
    request.body = {
      card_num: request.query.card_num,
      startDate: request.query.startDate,
      endDate: request.query.endDate,
      page: request.query.page,
      limit: request.query.limit
    };
    return getProcode(request, reply);
  });
}

module.exports = fp(routes);
