/**
 * Справочник кодов ответов от платежной системы
 * Коды и их описания
 */

const RESPONSE_CODES = {
  "00": "Approved",
  "01": "Refer to issuer",
  "02": "Refer to issuer (special)",
  "03": "Invalid merchant",
  "04": "Pick up card",
  "05": "Do not honor",
  "06": "Error",
  "07": "Pick up card (special)",
  "08": "Honour with identification",
  "09": "Request in progress",
  10: "Approved for partial amount",
  11: "VIP Approval",
  12: "Invalid transaction",
  13: "Invalid amount",
  14: "Card number does not exist",
  15: "No such issuer",
  16: "Approved, update track 3",
  17: "Customer cancellation",
  18: "Customer dispute",
  19: "Re-enter transaction",
  20: "Invalid response",
  21: "No action taken (no match)",
  22: "Suspected malfunction",
  23: "Unacceptable transaction fee",
  24: "File upd not supported by rc",
  25: "Unable to locate record",
  26: "Duplicate file update record",
  27: "File update field edit error",
  28: "File temporarily unavailable",
  29: "File update not successful",
  30: "Format error",
  31: "Issuer sign-off",
  32: "Completed partially",
  33: "Expired card",
  34: "Suspected fraud",
  35: "Card acceptor contact acquir",
  36: "Restricted card",
  37: "Card acceptor call acquirer",
  38: "Allowable PIN tries exceeded",
  39: "No credit account",
  40: "Function not supported",
  41: "Pick up card (lost card)",
  42: "No universal account",
  43: "Pick up card (stolen card)",
  44: "No investment account",
  51: "Not sufficient funds",
  52: "No checking account",
  53: "No savings account",
  54: "Expired card",
  55: "Incorrect PIN",
  56: "No card record",
  57: "Trxn not permitted to card",
  58: "Trxn not permitted to card",
  59: "Suspected fraud",
  60: "Card acceptor contact acquir",
  61: "Exceeds withdrawal limit",
  62: "Restricted card",
  63: "Security violation",
  64: "Original amount incorrect",
  65: "Activity count exceeded",
  66: "Card acceptor call acquirer",
  67: "Card pick up at ATM",
  68: "Response received too late",
  75: "Too many wrong PIN tries",
  76: "Previous message not found",
  77: "Data does not match original",
  79: "Transaction Already Reversed",
  80: "Invalid date",
  81: "Cryptographic error in PIN",
  82: "Incorrect CVV",
  83: "Unable to verify PIN",
  84: "Invld authorization life cyc",
  85: "No reason to decline",
  86: "PIN validation not possible",
  88: "Cryptographic failure",
  89: "Authentication failure",
  90: "Cutoff is in process",
  91: "Issuer or switch inoperative",
  92: "No routing path",
  93: "Violation of law",
  94: "Duplicate transmission",
  95: "Reconcile error",
  96: "System malfunction",
  XA: "Forward to issuer",
  XD: "Forward to issuer",
};

/**
 * Получить описание по коду ответа
 * @param {string} code - Код ответа
 * @returns {string} - Описание кода
 */
function getResponseDescription(code) {
  // Если код передан как число, преобразуем в строку с ведущим нулем
  if (typeof code === "number") {
    code = code < 10 ? `0${code}` : `${code}`;
  }

  // Для пустого или null кода
  if (!code) return "Unknown";

  // Убираем пробелы, если они есть
  code = code.toString().trim();

  // Возвращаем описание или 'Unknown' если код неизвестен
  return RESPONSE_CODES[code] || "Unknown response code";
}

module.exports = {
  RESPONSE_CODES,
  getResponseDescription,
};
