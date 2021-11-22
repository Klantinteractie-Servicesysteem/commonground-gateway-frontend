
/**
 * This function serves a file to the user.
 * @param base64 base64 of the file
 * @param filename the name used for serving the file
 * @param extension what extension the file needs to receive
 */
export function documentDownload(base64: string, filename: string, extension: string) {
  let element = document.createElement('a');
  element.setAttribute('href', base64);
  element.setAttribute('download', filename + extension);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
