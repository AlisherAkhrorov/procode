const OPERATION_TYPES = {
  "0410": {
    "012000": "CR",
    "003000": "CR",
    "011000": "CR",
    100000: "DR",
    110000: "CR",
    170000: "CR",
  },
  "0110": {
    "012000": "DR",
    "002000": "DR",
    "010000": "DR",
    "003000": "DR",
    "000000": "DR",
    "001000": "DR",
    "013000": "DR",
    "003030": "DR",
    100000: "DR",
    170000: "DR",
    110000: "DR",
    200000: "CR",
    280000: "CR",
    203000: "CR",
    260000: "CR",
  },
  "0120": {
    "000000": "DR",
    "010000": "DR",
    200000: "CR",
  },
  "0420": {
    "000000": "CR",
  },
  "0430": {
    "000000": "CR",
  },
};

function getOperationTypeByProcCode(msgType, procCode) {
  const codeStr = String(procCode);
  if (codeStr.startsWith("3")) {
    return "BALANCE";
  }

  if (codeStr.startsWith("9")) {
    return "PIN CHANGE";
  }
  return OPERATION_TYPES[msgType][procCode];
}

module.exports = { OPERATION_TYPES, getOperationTypeByProcCode };
