import * as React from 'react'

interface Value {
  id: string,
  key?: string,
  value: string,
}

const ElementCreationNew: React.FC = () => {
  const valueInputEl = React.useRef(null)
  const [values, setValues] = React.useState<Value[]>([])

  const handleAdd = () => {
    if (!valueInputEl.current.value) return

    setValues([...values, { id: Math.random().toString(36), value: valueInputEl.current.value}])

    valueInputEl.current.value = null // empty input after processing
  }

  const handleDelete = (e) => {
    setValues(values.filter(value => value.id !== e.target.id))
  }

  return (
    <>
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

      <input ref={valueInputEl} type="text" />
      <button onClick={handleAdd}>Add</button>
    </>
  )
}

export default ElementCreationNew
