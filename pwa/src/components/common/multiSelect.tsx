import * as _ from "lodash";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

interface MultiSelectProps {
  id: string;
  label: string;
  options: ISelectOption[];
  data?: any;
}

interface ISelectOption {
  id: string,
  name: string,
  value: string
}

interface IValue {
  id: string,
  value: string
}

const MultiSelect: React.FC<MultiSelectProps> = ({ id, label, data, options }) => {
  const [value, setValue] = React.useState<string>("");
  const [values, setValues] = React.useState<IValue[]>([]);

  React.useEffect(() => {
    if (!data) return;

    const loadedValues: IValue[] = data?.map((value) => {
      return { id: generateId(), value: value };
    });

    setValues([...loadedValues]);
  }, [data]);

  const handleAdd = () => {
    setValues([...values, { id: generateId(), value: value }]);
    setValue("");
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setValues(values.filter(value => value.id !== e.target.id));
  };

  const generateId = (): string => Math.random().toString(36);

  return (
    <div>
      {values.length > 0 &&
      <ul style={{ paddingLeft: 0 }}>
        {values.map((value, idx) => {
          return (
            <li key={idx} style={{ listStyleType: "none" }}>
              <div className="row">
                <div className="col-10">
                  <input
                    disabled
                    type="text"
                    id={value.value}
                    value={value.value}
                    name={`${id}[${value.value}]`}
                    className="utrecht-textbox utrecht-textbox--html-input mb-2"
                  />
                </div>
                <div className="col-2">
                  <button
                    id={value.id}
                    onClick={handleDelete}
                    className="utrecht-button utrecht-button-sm btn-danger"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      }

      <div className="row">
        <h5>Create {label}</h5>
        <div className="col-10">
          <div className="input-group">
            <select
              defaultValue={value ?? data}
              className="utrecht-select utrecht-select--html-select"
              onChange={(e) => setValue(e.target.value)}
            >
              <option value="">
                Select an option
              </option>
              {options.map((option, idx) => (
                <option key={idx} value={value ? `${value}${option.id}` : option.value}>
                  {_.upperFirst(option.name)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-2 select-elementCreation-button">
          <button className="utrecht-button utrecht-button-sm btn-success" onClick={handleAdd} disabled={!value}>
            <FontAwesomeIcon icon={faPlus} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
