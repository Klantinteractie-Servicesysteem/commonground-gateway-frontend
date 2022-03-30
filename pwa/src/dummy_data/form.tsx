const formJson = {
  components: [
    {
      input: true,
      tableView: true,
      type: "textfield",
      key: "name",
      label: "Name",
      validation: {
        required: true,
      },
    },
    {
      input: true,
      tableView: true,
      type: "button",
      key: "submit",
      label: "Submit",
    },
  ],
};

export default formJson;

// `{"components": [{"input": true,"tableView": true,"inputMask": "","prefix": "","suffix": "","persistent": true,"autofocus": false,"hidden": false,"clearOnHide": true,"spellCheck": false,"label": "saturday","key": "saturday","multiple": false,"defaultValue": "","placeholder": "","unique": "","validate": {"required": true,"minLength": "","maxLength": 255,"pattern": "",              "custom": "","customPrivate": false},"type": "textfield"},{"type": "button","theme": "primary","disableOnInvalid": true,"action": "submit","rightIcon": "","leftIcon": "","size": "md","key": "submit","tableView": false,"label": "Submit","input": "true"}],"display": "form","page": 0}`;
