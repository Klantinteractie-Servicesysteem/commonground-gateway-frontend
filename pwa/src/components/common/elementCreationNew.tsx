import * as React from 'react'

interface IValue {
  id: string,
  value: string,
}

const ElementCreationNew: React.FC = () => {
  const [value, setValue] = React.useState<string>("")
  const [values, setValues] = React.useState<IValue[]>([])

  const handleAdd = () => {
    setValues([...values, { id: Math.random().toString(36), value: value }])
    setValue("")
  }

  const handleDelete = (e) => { setValues(values.filter(value => value.id !== e.target.id)) }

  return (
    <div>
      {values.length > 0 &&
        <ul>
          {values.map((value, idx) => {
            return (
              <li key={idx}>
                {value.value}
                <button id={value.id} onClick={handleDelete}>Delete</button>
              </li>
            )
          })}
        </ul>
      }

      <input value={value} onChange={(e) => setValue(e.target.value)} type="text" />
      <button onClick={handleAdd} disabled={!value}>Add</button>
    </div>
  )
}

export default ElementCreationNew
