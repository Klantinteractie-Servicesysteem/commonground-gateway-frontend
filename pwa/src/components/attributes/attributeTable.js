import * as React from "react";
import {useUrlContext} from "../../context/urlContext";
import {useEffect} from "react";


export default function AttributeTable() {
  const [attributes, setAttributes] = React.useState(null);
  const context = useUrlContext();


  useEffect(() => {
    if (typeof window !== "undefined") {
      getAttributes();
    }
  }, []);

  const getAttributes = () => {
    fetch(context.apiUrl + '/attributes', {
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        setAttributes(data['hydra:member']);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <div className="card">
      <div className="card-body">
        <table lang="nl" summary="Overzicht van de stemmen voor en tegen het betaald parkeren." style={{width: "100%"}}>
          <caption>Hier kunnen we een caption neerzetten</caption>
          <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col" className="numeric">Type</th>
            <th scope="col" className="text"> </th>
          </tr>
          </thead>
          {
            attributes !== null &&
            <tbody>
            {
              attributes.map((row) => (
                <tr>
                  <td>{row.name}</td>
                  <td>{row.type}</td>
                  <td><a className="utrecht-link utrecht-link--hover" href={"/attributes/" + row.id}>Bekijken</a></td>
                </tr>
              ))
            }
            </tbody>
          }
        </table>
      </div>
    </div>
  );
}
