import * as _ from "lodash";

/**
 * Checks if provided values array contains empty or whitespace values.
 *
 * @param {array} array
 * @returns True or false depending on if there are empty values
 */
export const checkValues = (array: any[]) => {
  let valid = true;
  for (let i = 0; i < array.length; i++) {
    if (array[i].length === 0 || _.isEmpty(array[i])) {
      valid = false;
    }
  }
  return valid;
};

/**
 * Removed empty values from object.
 * @param obj
 * @returns Object without empty values
 */
export const removeEmptyObjectValues = (obj: {}) => {
  for (var propName in obj) {
    if (
      obj[propName] === undefined ||
      (obj[propName] === null && obj[propName] !== false) || obj[propName] === ''
    ) {
      delete obj[propName];
    }
  }
  return obj;
};

/**
 * retrieves html defined array from form as object
 * @param  array the array that will be searched for the array items
 * @param type what needs to be searched in the array
 * @returns object of found array values.
 */
export const retrieveFormArrayAsObject = (array: any[], type: string) => {
  let result = {};

  for (let i = 0; i < array.length; i++) {
    let target = array[i];

    if (target.name.includes(type)) {
      result[
        target.name.substring(
          target.name.indexOf("[") + 1,
          target.name.lastIndexOf("]")
        )
      ] = target.value;
    }
  }

  return result;
};

/**
 * retrieves html defined array from form as array
 * @param  array the array that will be searched for the array items
 * @param type what needs to be searched in the array
 * @returns array of found array values.
 */
export const retrieveFormArrayAsOArray = (array: any[], type: string) => {
  let result = [];

  for (let i = 0; i < array.length; i++) {
    let target = array[i];

    if (target.name.includes(type)) {
      result.push(target.value);
    }
  }

  return result;
};
