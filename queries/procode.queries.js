/**
 * Запросы для работы с процессинговым кодом
 */
const getProcodeQuery = `
    SELECT * FROM (
    SELECT 
   a.PRIMECARDSERNO as CardSerno,
      ROWNUM as RowNumber,
      a.I002_NUMBER as CardNumber,
      a.I038_AUTH_ID as AuthID,
      a.serno as AuthSerno,
      a.LTIMESTAMP at LOCAL as AuthDateTime,
      a.I004_AMT_TRXN as AuthAmount,
      a.OTB_AMT_CARD, 
      a.AMT_CARD as CardAmount, 
      a.I049_CUR_TRXN as AuthCurrency,
      a.CARDCURRENCY as CardCurrency,
      a.I019_ACQ_COUNTRY as AuthCountry,
      a.I032_ACQUIRER_ID as AcquirerID,
      a.I043A_MERCH_NAME as MerchantName,
      a.I018_MERCH_TYPE as MerchantType,
      a.I042_MERCH_ID as MerchantID,
      a.I043B_MERCH_CITY as MerchantCity, 
      a.I000_msg_type as MessageType,
      a.I003_proc_code as ProcCode,
      a.SOURCE as AuthSource,
      a.I039_RSP_CD as ResponseCode,
      r.description as ResponseDescription,
      a.I037_RET_REF_NUM as RetrievalReferenceNumber,
      a.REASONCODE as ReasonCode,
      a.trxnserno as TrxnSerno,
      CASE
        WHEN a.trxnserno > 0 THEN 'Matched'
        WHEN a.trxnserno = -1 THEN 'Dropped because of too old'
        WHEN a.trxnserno = -2 THEN 'Replenished'
        WHEN a.trxnserno = -3 THEN 'Manually cancelled'
        WHEN a.trxnserno = -4 THEN 'Reversed'
        WHEN a.trxnserno = -5 THEN 'Financial cleared'
        WHEN a.trxnserno IS NULL THEN 'Outstanding'
        ELSE 'Unknown Status'
      END AS TrxnSernoStatus,
      s.description as ReasonDescription,
      COUNT(*) OVER() as TOTAL_ROWS
    FROM 
      authorizations a 
    LEFT JOIN RESPCODES r
         ON r.code = a.I039_RSP_CD
    LEft JOIN SYSTEMREASONS s
         ON s.reasoncode = a.reasoncode
    WHERE 
      I002_NUMBER=:card_num
    AND r.format='V'
    AND 
      LTIMESTAMP 
    BETWEEN 
      TO_DATE(:startDate, 'DD-MM-YYYY') 
    AND 
      TO_DATE(:endDate || ' 23:59:59', 'DD-MM-YYYY HH24:MI:SS')
    ORDER BY 
      a.LTIMESTAMP DESC
  ) WHERE ROWNUM > :offset AND ROWNUM <= :end_offset
`;

module.exports = {
  getProcodeQuery,
};
