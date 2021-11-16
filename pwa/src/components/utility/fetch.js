export const getResource = (url = "", query = "", options = {}) => {
  fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('something went wrong');
      }
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error('Error:', error);
      return null;
    });
}
