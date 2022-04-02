import * as React from "react";
import { Card, Modal, Spinner } from "@conductionnl/nl-design-system/lib";
import { navigate } from "gatsby-link";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { LoadingOverlayContext } from "../../context/loadingOverlayContext";
import { useForm } from "react-hook-form";
import { InputText, InputCheckbox, SelectSingle, Textarea } from "../formFields";
import { resourceArrayToSelectArray } from "../../services/resourceArrayToSelectArray";
import { ISelectValue } from "../formFields/types";
import { useQueryClient } from "react-query";
import { useEntity } from "../../hooks/entity";

interface EntityFormProps {
  entityId: string;
}

export const EntityForm: React.FC<EntityFormProps> = ({ entityId }) => {
  const [sources, setSources] = React.useState<any>(null);
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

  const queryClient = useQueryClient();

  const _useEntity = useEntity(queryClient);
  const getEntity = _useEntity.getOne(entityId);
  const createOrEditEntity = _useEntity.createOrEdit(entityId);

  React.useEffect(() => {
    setHeader("Object Type");

    if (getEntity.isSuccess) {
      const entity = getEntity.data;
      setHeader(
        <>
          Object Type: <i>{entity.name}</i>
        </>,
      );

      handleSetFormValues(entity);
    }
  }, [getEntity.isSuccess]);

  React.useEffect(() => {
    handleSetSources();
  }, [API]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm();

  const onSubmit = (data): void => {
    data.function = data.function && data.function.value;
    data.gateway = data.gateway && data.gateway.value;

    createOrEditEntity.mutate({ payload: data, id: entityId });
  };

  const handleSetFormValues = (entity): void => {
    const basicFields: string[] = ["name", "endpoint", "route", "description", "extend"];
    basicFields.forEach((field) => setValue(field, entity[field]));

    setValue(
      "function",
      functionSelectOptions.find((option) => option.value === entity.function),
    );

    entity.gateway &&
      setValue("gateway", { label: entity.gateway.name, value: `/admin/gateways/${entity.gateway.id}` });
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
                type="button"
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
                {getEntity.isLoading ? (
                  <Spinner />
                ) : (
                  <div>
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
