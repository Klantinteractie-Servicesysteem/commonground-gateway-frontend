import * as React from "react";
import {useEffect} from "react";
import {useUrlContext} from "../../context/urlContext";

export default function EntitiesTable() {
  const [entities, setEntities] = React.useState(null);
  const context = useUrlContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      getEntities();
    }
  }, []);

  const getEntities = () => {
    fetch(context.apiUrl + '/entities', {
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
        setEntities(data['hydra:member']);
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
            <th scope="col" className="numeric">Endpoint</th>
            <th scope="col" className="numeric">Route</th>
            <th scope="col" className="text"> </th>
          </tr>
          </thead>
          {
            entities !== null &&
            <tbody>
            {
              entities.map((row) => (
                <tr>
                  <td>{row.name}</td>
                  <td>{row.endpoint}</td>
                  <td>{row.route}</td>
                  <td><a className="utrecht-link utrecht-link--hover" href={"/entities/" + row.id}>Bekijken</a></td>
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
