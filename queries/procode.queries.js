/**
 * Запросы для работы с процессинговым кодом
 */

const getProcodeQuery = `
  SELECT * FROM (
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
      I000_msg_type as MessageType,
      I003_proc_code as ProcCode,
      SOURCE as AuthSource,
      I039_RSP_CD as ResponseCode,
      I037_RET_REF_NUM as RetrievalReferenceNumber,
      REASONCODE as ReasonCode,
      COUNT(*) OVER() as TOTAL_ROWS
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
      LTIMESTAMP ASC
  ) WHERE ROWNUM > :offset AND ROWNUM <= :end_offset
`;

module.exports = {
  getProcodeQuery,
};
