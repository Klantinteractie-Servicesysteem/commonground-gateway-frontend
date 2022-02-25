import * as React from "react";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import ObjectEntityFormNew from "../../../../components/objectEntities/ObjectEntityFormNew";
import { HeaderContext } from "../../../../context/headerContext";

const IndexPage = (props) => {
  const entityId: string = props.params.id === "new" ? null : props.params.id;
  const objectEntityId: string = props.params.objectEntityId === "new" ? null : props.params.objectEntityId;
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader({title: "Object", subText: "Edit or view your object"})
  }, [setHeader]);

  return (
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              {props.params.id !== "new" ? (
                <Tabs
                  items={[
                    { name: "Edit", id: "edit", active: true }
                  ]}
                />
              ) : (
                <Tabs
                  items={[{ name: "Edit", id: "edit", active: true }]}
                />
              )}
            </div>
            <div className="tab-content">
              <div
                className="tab-pane active"
                id="overview"
                role="tabpanel"
                aria-labelledby="overview-tab"
              >
                <br />
                <ObjectEntityFormNew entityId={entityId} objectEntityId={objectEntityId} />
              </div>
            </div>
          </div>
        </div>
      </main>
  );
};

export default IndexPage;
