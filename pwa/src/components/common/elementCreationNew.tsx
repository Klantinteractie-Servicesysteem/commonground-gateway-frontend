import * as React from 'react'

interface Value {
  id: string,
  value: string,
}

const ElementCreationNew: React.FC = () => {
  const valueInputEl = React.useRef(null)
  const [value, setValue] = React.useState<string>()
  const [values, setValues] = React.useState<Value[]>([])

  const handleAdd = () => {
    setValues([...values, { id: Math.random().toString(36), value: valueInputEl.current.value}])
    setValue('') // cleanup after processing
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

      <input value={value} onChange={(e) => setValue(e.target.value)} ref={valueInputEl} type="text" />
      <button onClick={handleAdd} disabled={value.length < 1}>Add</button>
    </div>
  )
}

export default ElementCreationNew
