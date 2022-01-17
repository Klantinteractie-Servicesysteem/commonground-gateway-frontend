import * as React from 'react'

interface ElementCreationNewProps {
  id: string,
  data?: any,
}

interface IValue {
  id: string,
  value: string,
}

const ElementCreationNew: React.FC<ElementCreationNewProps> = ({id, data}) => {
  const [value, setValue] = React.useState<string>("")
  const [values, setValues] = React.useState<IValue[]>([])

  React.useEffect(() => {
    if (!data) return

    const loadedValues: IValue[] = data?.map((value) => {
      return { id: generateId(), value: value}
    })

    setValues([...loadedValues])
  }, [data])

  const handleAdd = () => {
    setValues([...values, { id: generateId(), value: value }])
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
        <ul>
          {values.map((value, idx) => {
            return (
              <li key={idx}>
                <input value={value.value} name={`${id}[${value.value}]`} id={value.value} type="text" disabled/>
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
