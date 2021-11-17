export function documentDownload(base64, filename, extension) {
  let element = document.createElement('a');
  element.setAttribute('href', base64);
  element.setAttribute('download', filename + extension);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
