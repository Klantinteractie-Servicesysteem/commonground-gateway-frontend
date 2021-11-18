export const createElement = (
  tagName,
  className = [],
  attributes = {},
  value = "",
  innerText = "",
  onclick = null
) => {
  // create element
  let element = document.createElement(tagName);

  // set element value
  element.value = value;

  // set element inner text
  element.innerText = innerText;

  // add attributes to element
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  // add classes to attribute
  for (let i = 0; i < className.length; i++) {
    element.classList.add(className[i]);
  }

  if (onclick !== null) {
    element.addEventListener("click", onclick, false);
  }

  return element;
};
