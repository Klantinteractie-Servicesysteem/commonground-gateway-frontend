/**
 * This getResource.
 *
 * @param {string} url set the name in the cell key.
 * @param {string} query
 * @param {array} options
 */

export const getResource = (url = "", query = "", options = {}) => {
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("something went wrong");
      }
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error("Error:", error);
      return null;
    });
};
