import * as React from 'react'
import {SelectInputComponent} from "@conductionnl/nl-design-system";

interface ElementCreationNewProps {
  id: string;
  label: string;
  data?: any;
  select?: boolean;
  selectName?: string;
  options?: Array<Partial<Record<"value" | "name" | "id" | "selected", any>>>;
}

interface IValue {
  id: string,
  value: string,
}

const ElementCreationNew: React.FC<ElementCreationNewProps> = ({id, label, data, select, selectName, options}) => {
  const [value, setValue] = React.useState<string>("")
  const [values, setValues] = React.useState<IValue[]>([])

  React.useEffect(() => {
    if (!data) return

    const loadedValues: IValue[] = data?.map((value) => {
      return {id: generateId(), value: value}
    })

    setValues([...loadedValues])
  }, [data])

  const handleAdd = () => {
      setValues([...values, {id: generateId(), value: value}])
    setValue("")
  }

  const handleDelete = (e) => {
    e.preventDefault()
    setValues(values.filter(value => value.id !== e.target.id))
  }

  const generateId = (): string => Math.random().toString(36)

  return (
    <div>
      {values.length > 0 &&
      <ul style={{paddingLeft: 0}}>
        {values.map((value, idx) => {
          return (
            <li key={idx} style={{listStyleType: 'none'}}>
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
                    <i className="fas fa-trash mr-2"/>Delete
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      }

      <div className="row">
        <h5>Create {label}</h5>
        <div className="col-10">
          {
            select ? (
              <div className="form-group">
                <SelectInputComponent
                  options={options !== null && options.length > 0 ? options : []}
                  name={selectName} id={`${selectName}Input`}
                  nameOverride={label}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            ) : (
              <input
                type="text"
                value={value}
                placeholder={`Add ${label}`}
                onChange={(e) => setValue(e.target.value)}
                className="utrecht-textbox utrecht-textbox--html-input mb-2"
              />
            )
          }
        </div>
        <div className="col-2">
          <button className="utrecht-button utrecht-button-sm btn-success" onClick={handleAdd} disabled={!value}>
            <i className="fas fa-plus mr-2" />Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default ElementCreationNew
