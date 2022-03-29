export const validateJSON = (_json: string): boolean|string => {
  const RegExp: RegExp = /^[0-9]+$/;

  if (RegExp.test(_json)) return 'Invalid JSON';

  try {
    JSON.parse(_json);
    return true;
  } catch {
    return 'Invalid JSON';
  }
};
