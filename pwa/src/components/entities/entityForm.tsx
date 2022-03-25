import * as React from "react";
import { Card, Modal, Spinner } from "@conductionnl/nl-design-system/lib";
import { navigate } from "gatsby-link";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { useForm } from "react-hook-form";
import { InputText, InputCheckbox, SelectSingle, Textarea } from "../formFields";
import { resourceArrayToSelectArray } from "../../services/resourceArrayToSelectArray";
import { ISelectValue } from "../formFields/types";

interface EntityFormProps {
  entityId: string;
}

export const EntityForm: React.FC<EntityFormProps> = ({ entityId }) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [sources, setSources] = React.useState<any>(null);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const title: string = entityId ? "Edit Object type" : "Create Object type";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  const functionSelectOptions: ISelectValue[] = [
    { label: "Organization", value: "organization" },
    { label: "User", value: "user" },
    { label: "User group", value: "userGroup" },
  ];

  React.useEffect(() => {
    setHeader("Object Type");
    handleSetSources();
    entityId && handleSetEntity();
  }, [API, entityId]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm();

  const onSubmit = (data): void => {
    setLoadingOverlay(true);

    data.function = data.function && data.function.value;
    data.gateway = data.gateway && data.gateway.value;

    API.Entity.createOrUpdate(data, entityId)
      .then(() => {
        setAlert({ message: `${entityId ? "Updated" : "Saved"} object type`, type: "success" });
        navigate("/entities");
      })
      .catch((err) => {
        setAlert({ type: "danger", message: err.message });
        throw new Error("Create or update entity error: " + err);
      })
      .finally(() => {
        setLoadingOverlay(false);
      });
  };

  const handleSetEntity = () => {
    setShowSpinner(true);

    API.Entity.getOne(entityId)
      .then((res) => {
        setValue("name", res.data.name);
        setValue(
          "function",
          functionSelectOptions.find((option) => option.value === res.data.function),
        );
        setValue("endpoint", res.data.endpoint);
        setValue("route", res.data.route);
        res.data.gateway &&
          setValue("gateway", { label: res.data.gateway.name, value: `/admin/gateways/${res.data.gateway.id}` });
        setValue("description", res.data.description);
        setValue("extend", res.data.extend);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET entity error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetSources = () => {
    API.Source.getAll()
      .then((res) => {
        setSources(resourceArrayToSelectArray(res.data, "gateways"));
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET sources error: " + err);
      });
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get("object_types")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET documentation error: " + err);
      });
  };

  return (
    <form id="dataForm" onSubmit={handleSubmit(onSubmit)}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <div>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#entityHelpModal"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <Modal
                title="Object Type Documentation"
                id="entityHelpModal"
                body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
              />
              <Link className="utrecht-link" to={"/entities"}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2" />
                  Back
                </button>
              </Link>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit" disabled={!sources}>
                <i className="fas fa-save mr-2" />
                Save
              </button>
            </div>
          );
        }}
        cardBody={function () {
          return (
            <div className="row">
              <div className="col-12">
                {showSpinner ? (
                  <Spinner />
                ) : (
                  <div>
                    {loadingOverlay && <LoadingOverlay />}
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText name="name" label="Name" {...{ register, errors }} validation={{ required: true }} />
                      </div>
                      <div className="col-6">
                        <SelectSingle
                          name="function"
                          label="Function"
                          options={functionSelectOptions}
                          validation={{ required: true }}
                          {...{ control, errors }}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText name="endpoint" label="Endpoint" {...{ register, errors }} />
                      </div>
                      <div className="col-6">
                        <InputText name="route" label="Route" {...{ register, errors }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <SelectSingle name="gateway" label="Source" options={sources ?? []} {...{ control, errors }} />
                      </div>
                      <div className="col-6">
                        <Textarea name="description" label="Description" {...{ register, errors }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputCheckbox name="extend" label="Extend" {...{ register, errors }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />
    </form>
  );
};
export default EntityForm;
