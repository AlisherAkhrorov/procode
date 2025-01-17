const hdb = require('./hdb');

async function getProcode(req, res) {
  let connection;

  const { card_num, startDate, endDate } = req.body;

  try {
    console.log(card_num);
    connection = await hdb.getConnection();
    const query = `
      SELECT LTIMESTAMP, OTB_AMT_CARD, AMT_CARD, I043A_MERCH_NAME, I043B_MERCH_CITY, 
             I039_RSP_CD, I019_ACQ_COUNTRY, I000_MSG_TYPE, I003_PROC_CODE 
      FROM authorizations 
      WHERE i002_number = ${card_num}
      AND LTIMESTAMP BETWEEN TO_DATE( '${startDate}', 'DD-MM-YYYY') 
      AND TO_DATE( '${endDate}', 'DD-MM-YYYY')
    `;
    const result = await connection.execute(query);

    const formattedResult = {
      rows: result.rows.map(row => {
        let rowData = {};
        result.metaData.forEach((meta, index) => {
          rowData[meta.name] = row[index];
        });
        return rowData;
      })
    };

    res.json(formattedResult);

  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

module.exports = {
  getProcode,
};
