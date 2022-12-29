import { ServerPermissions } from "../../roles/permissions/permissions.constants";
import { UserPermissions } from "../../users/users.service";

export const hasPermission = (
  permissions: UserPermissions | null,
  permission: ServerPermissions
) => {
  const hasPermission = permissions?.serverPermissions.has(permission);
  if (!hasPermission) {
    return false;
  }
  return true;
};
