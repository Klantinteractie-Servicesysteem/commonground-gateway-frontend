/**
 * This components handles element creations.
 * @returns JSX of the generated form.
 */
export const createElement = (
  tagName: any,
  className: any[],
  attributes = {},
  value = "",
  innerText = "",
  onclick = null,
) => {
  // create element
  const element = document.createElement(tagName);

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
  container: any,
  newKey: any,
  newValue: any,
  inputName: any,
  onClickFunction?: any,
  label = true,
) => {
  const key = document.getElementById(newKey) as HTMLInputElement;
  const value = document.getElementById(newValue) as HTMLInputElement;
  const form = document.getElementById(container) as HTMLInputElement;

  if (key.value.length === 0 || value.value.length === 0) {
    return;
  }

  //create row
  const formGroupRow = createElement("div", ["row", key.value.replaceAll(" ", "-")]);

  //set classNames for elements

  // create input value
  const formGroupColValue = createElement("div", ["col-5"]);
  const formGroupValue = createElement("div", ["from-group"]);
  let inputLabel = null;
  if (label) {
    inputLabel = createElement("label", ["utrecht-form-label"], { for: value.value }, "", `${key.value}`);
  }
  const inputValue = createElement(
    "input",
    ["utrecht-textbox", "utrecht-textbox--html-input", "mb-2"],
    {
      type: "text",
      id: value.value,
      name: `${inputName}[${key.value.replaceAll(" ", "-")}]`,
    },
    `${value.value}`,
  );

  //create delete button
  const formGroupButton = createElement("div", ["col-2", "d-flex", "mt-auto", "mb-3"]);
  const deleteButton = createElement(
    "button",
    ["utrecht-button", "utrecht-button-sm", "btn-sm", "btn-danger"],
    { type: "button" },
    `${key.value}`,
    "Delete",
    onClickFunction,
  );

  // adds the inputs in the div form-group
  if (inputLabel !== null) {
    formGroupValue.appendChild(inputLabel);
  }
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

export const deleteElementFunction = (event: any) => {
  const elements = document.getElementsByClassName(event.target.value);

  for (let i = 0; i < elements.length; i++) {
    elements[i].remove();
  }
};

export const closeModal = (id: string) => {
  const element = document.createElement("button") as HTMLInputElement;
  const modal = document.getElementById("modalFooter" + id) as HTMLInputElement;

  element.setAttribute("data-bs-dismiss", "modal");
  element.style.display = "none";

  modal.appendChild(element);

  element.click();

  modal.removeChild(element);
};
