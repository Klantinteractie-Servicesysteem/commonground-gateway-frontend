export const validateJSON = (data: string): boolean | string => {
  const RegExp: RegExp = /^[0-9]+$/;
  const invalidMessage = "This field contains invalid JSON";

  if (!data) return true; // empty data should not be validated

  if (RegExp.test(data)) return invalidMessage;

  try {
    return JSON.parse(data) && true;
  } catch {
    return invalidMessage;
  }
};
