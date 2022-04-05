export const validateLength = (data: string): boolean | string => {
  const invalidMessage = "This field contains more than the 255 character limit";

  if (!data) return true; // empty data should not be validated

  if (data.length > 255) return invalidMessage;
};
