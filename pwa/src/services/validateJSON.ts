export const validateJSON = (data: string): boolean | string => {
  const RegExp: RegExp = /^[0-9]+$/;
  const invalidMessage = "This field contains invalid JSON";
  const invalidLengthMessage = "Field contains too many characters"

  if (!data) return true; // empty data should not be validated

  if (RegExp.test(data)) return invalidMessage;

  if (data.length > 255) return invalidLengthMessage;

  try {
    return JSON.parse(data) && true;
  } catch {
    return invalidMessage;
  }
};
