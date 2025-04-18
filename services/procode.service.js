const hdb = require("../config/hdb");
const oracledb = require('oracledb');
const { getProcodeQuery } = require('../queries/procode.queries');

/**
 * Проверка на транзиентные ошибки, которые можно повторить
 */
function isTransientError(err) {
  const transientErrorCodes = [3113, 3114, 12541, 12170];
  return err.errorNum && transientErrorCodes.includes(err.errorNum);
}

/**
 * Выполнение запроса с механизмом повторных попыток
 */
async function executeQueryWithRetry(connection, query, binds, options = {}, maxRetries = 3) {
  let retries = 0;
  let lastError;
  
  while (retries <= maxRetries) {
    try {
      return await connection.execute(query, binds, options);
    } catch (err) {
      lastError = err;
      
      if (retries >= maxRetries || !isTransientError(err)) {
        throw err;
      }
      
      console.log(`Повторная попытка ${retries + 1} после ошибки: ${err.message}`);
      // Экспоненциальная задержка перед повтором
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
      retries++;
    }
  }
  
  throw lastError;
}

/**
 * Форматирование результатов запроса
 */
function formatRows(rows, columnNames) {
  return rows.map((row) => {
    const objectRow = Object.fromEntries(
      columnNames.map((name, index) => [
        name,
        typeof row[index] === "string" ? row[index].trim() : row[index],
      ])
    );

    objectRow["ResponseDescription"] =
      objectRow["REASONCODE"] === 0 ? "Approved" : "Declined";
    return objectRow;
  });
}

/**
 * Получение данных процессингового кода
 */
async function getProcodeData({ card_num, startDate, endDate, page, limit }) {
  let connection;
  try {
    connection = await hdb.getConnection();
    
    const offset = (page - 1) * limit;
    const binds = {
      card_num: {
        type: oracledb.DB_TYPE_CHAR,
        dir: oracledb.BIND_IN,
        val: card_num,
      },
      startDate,
      endDate,
      offset,
      end_offset: offset + limit
    };
    
    const result = await executeQueryWithRetry(connection, getProcodeQuery, binds, { maxRows: limit });
    
    const columnNames = result.metaData.map(({ name }) => name);
    const formattedRows = formatRows(result.rows, columnNames);
    
    // Получаем общее количество записей
    const totalRows = formattedRows.length > 0 ? formattedRows[0].TOTAL_ROWS : 0;
    const totalPages = Math.ceil(totalRows / limit);
    
    return {
      rows: formattedRows,
      pagination: {
        page,
        limit,
        total: totalRows,
        totalPages
      }
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Ошибка закрытия соединения:", err);
      }
    }
  }
}

module.exports = {
  getProcodeData
};
