export const editableActionObject = {
  // editable can be edited from end user side
  create: false,
  read: true,
  update: false,
  delete: false,
  display: true
};

export const hiddenActionObject = {
  // Read only has display to set false
  create: false,
  read: true,
  update: false,
  delete: false,
  display: false
};

export const defaultActionObject = {
  ...editableActionObject,
  read: true
};

const DefaultPermissions = {
  actions: {
    userManagement: editableActionObject
  }
};

export default DefaultPermissions;
