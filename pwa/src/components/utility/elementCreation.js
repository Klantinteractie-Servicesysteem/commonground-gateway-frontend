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

export const addElement = (
  container,
  newKey,
  newValue,
  inputName,
  onClickFunction = null
) => {
  let key = document.getElementById(newKey);
  let value = document.getElementById(newValue);
  let form = document.getElementById(container);

  if (key.value.length == 0 || value.value.length == 0) {
    return;
  }

  //create row
  let formGroupRow = createElement("div", ["row", key.value]);

  //set classNames for elements

  // create input value
  let formGroupColValue = createElement("div", ["col-5"]);
  let formGroupValue = createElement("div", ["from-group"]);
  let inputLabel = createElement(
    "label",
    ["utrecht-form-label"],
    { for: value.value },
    "",
    key.value
  );
  let inputValue = createElement(
    "input",
    ["utrecht-textbox", "utrecht-textbox--html-input", "mb-2"],
    { type: "text", id: value.value, name: `${inputName}[${key.value}]` },
    value.value
  );

  //create delete button
  let formGroupButton = createElement("div", [
    "col-2",
    "d-flex",
    "mt-auto",
    "mb-3",
  ]);
  let deleteButton = createElement(
    "button",
    ["utrecht-button", "utrecht-button-sm", "btn-sm", "btn-danger"],
    { type: "button" },
    key.value,
    "Delete",
    onClickFunction
  );

  // adds the inputs in the div form-group
  formGroupValue.appendChild(inputLabel);
  formGroupValue.appendChild(inputValue);
  // adds the elements in in the col
  formGroupColValue.appendChild(formGroupValue);
  formGroupButton.appendChild(deleteButton);
  // adds the elements in the row
  formGroupRow.appendChild(formGroupColValue);
  formGroupRow.appendChild(formGroupButton);
  // adds the row to the newInputs div
  form.appendChild(formGroupRow);

  key.value = "";
  value.value = "";
};

export const deleteElementFunction = (event) => {
  let elements = document.getElementsByClassName(event.target.value);

  for (let i = 0; i < elements.length; i++) {
    elements[i].remove();
  }
};
