const hdb = require("../config/hdb");
const oracledb = require('oracledb');

async function getProcode(req, res, next) {
  let connection;

  const { card_num, startDate, endDate } = req.body;
  try {
    connection = await hdb.getConnection();
    const query = `
      SELECT 
        PRIMECARDSERNO as CardSerno,
        ROWNUM as RowNumber,
        I002_NUMBER as CardNumber,
        I038_AUTH_ID as AuthID,
        serno as AuthSerno,
        LTIMESTAMP as AuthDateTime,
        I004_AMT_TRXN as AuthAmount,
        OTB_AMT_CARD, 
        AMT_CARD as CardAmount, 
        I049_CUR_TRXN as AuthCurrency,
        CARDCURRENCY as CardCurrency,
        I019_ACQ_COUNTRY as AuthCountry,
        I032_ACQUIRER_ID as AcquirerID,
        I043A_MERCH_NAME as MerchantName,
        I018_MERCH_TYPE as MerchantType,
        I042_MERCH_ID as MerchantID,
        I043B_MERCH_CITY as MerchantCity, 
        I022_POS_ENTRY as POSEntry,
        SOURCE as AuthSource,
        I039_RSP_CD as ResponseCode,
        I037_RET_REF_NUM as RetrievalReferenceNumber,
        REASONCODE as ReasonCode
      FROM 
        authorizations 
      WHERE 
        I002_NUMBER=:card_num
      AND 
        LTIMESTAMP 
      BETWEEN 
        TO_DATE(:startDate, 'DD-MM-YYYY') 
      AND 
        TO_DATE(:endDate, 'DD-MM-YYYY')
      ORDER BY 
        LTIMESTAMP
      ASC
    `;

    const binds = {
      card_num: {
        type: oracledb.DB_TYPE_CHAR,
        dir: oracledb.BIND_IN,
        val: card_num,
      },
      startDate,
      endDate,
    };
    const result = await connection.execute(query, binds, {});
    const columnNames = result.metaData.map(({ name }) => name);
    const rows = result.rows.map((row) => {
      const objectRow = Object.fromEntries(
        columnNames.map((name, index) => [
          name,
          typeof row[index] === "string" ? row[index].trim() : row[index],
        ])
      );

      objectRow["ResponseDescription"] =
        objectRow["REASONCODE"] === 0 ? "Approved" : "Declined";
      return objectRow;
    }
    );

    res.json({ rows });
  } catch (err) {
    console.error("Error executing query:", err);
    next(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
        next(err);
      }
    }
  }
}

module.exports = {
  getProcode,
};
