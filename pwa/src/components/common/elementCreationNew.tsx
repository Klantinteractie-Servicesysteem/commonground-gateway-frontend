import * as React from "react";

interface ElementCreationNewProps {
  id: string;
  label: string;
  data?: any;
}

interface IValue {
  id: string,
  value: string,
}

const ElementCreationNew: React.FC<ElementCreationNewProps> = ({ id, label, data }) => {
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
                    Delete
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
          <input
            type="text"
            value={value}
            placeholder={`Add ${label}`}
            onChange={(e) => setValue(e.target.value)}
            className="utrecht-textbox utrecht-textbox--html-input mb-2"
          />
        </div>
        <div className="col-2">
          <div className="input-group">
            <button className="utrecht-button utrecht-button-sm btn-success" onClick={handleAdd} disabled={!value}>Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementCreationNew;
