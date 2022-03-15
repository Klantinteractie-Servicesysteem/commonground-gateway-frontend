export const validateJSON = (_json: string): boolean => {
  const RegExp: RegExp = /^[0-9]+$/;

  if (RegExp.test(_json)) return false;

  try {
    JSON.parse(_json);
    return true;
  } catch {
    return false;
  }
};
