interface ISelectOption {
  label: string;
  value: string;
}

export const resourceArrayToSelectArray = (resourceArray: any[], resourceName: string): ISelectOption[] => {
  return resourceArray.map((resource) => {
    return { label: resource.name, value: `/admin/${resourceName}/${resource.id}` };
  });
};
