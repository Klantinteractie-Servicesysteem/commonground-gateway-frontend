import * as React from 'react'

interface Value {
  key?: string,
  value: string,
}

const ElementCreationNew: React.FC = () => {
  const valueInputEl = React.useRef(null)
  const [values, setValues] = React.useState<Value[]>([])

  const handleAdd = (e) => {
    e.preventDefault() // this should not go to prod

    if (!valueInputEl.current.value) return

    setValues([...values, {value: valueInputEl.current.value}])
    valueInputEl.current.value = ""
  }

  const handleDelete = (e) => {
    e.preventDefault() // this should not go to prod

    const tempValues = [...values]


    console.log(tempValues)
    tempValues.splice(e.target.id, 1)
    console.log(tempValues)
    setValues(tempValues)
  }

  return (
    <>
      {values.length > 0 &&
        <ul>
          {values.map((value, idx) => {
            return (
              <li key={idx}>
                {value.value}
                <button id={idx.toString()} onClick={handleDelete}>Delete</button>
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
