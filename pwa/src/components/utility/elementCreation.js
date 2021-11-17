export const createElement = (tagName, value, type, className, onClick) => {
  tagName = document.createElement(tagName);
  tagName.setAttribute('type', type);
  tagName.setAttribute('id', value);
  tagName.setAttribute('name', value);
  tagName.value = value;

  if (onClick !== null) {
    tagName.setAttribute('onClick', onClick);
  }

  for (let i = 0; i < className.length; i++) {
    tagName.classList.add(className[i]);
  }

  return tagName;
}
