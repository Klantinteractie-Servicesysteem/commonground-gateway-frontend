import * as React from "react";
import {useUrlContext} from "../../context/urlContext";
import {useEffect} from "react";
import {Link} from "gatsby";


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
                  <td className="text-right"><Link to={"/attributes/" + row.id}><button className="utrecht-button btn-sm btn-success"><i className="fas fa-edit pr-1"></i>Edit</button></Link></td>
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
