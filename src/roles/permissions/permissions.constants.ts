export enum ServerPermissions {
  ManageEvents = "manage-events",
  ManageUsers = "manage-users",
  ManagePosts = "manage-posts",
  ManageComments = "manage-comments",
  ManageRoles = "manage-roles",
  ManageInvites = "manage-invites",
  CreateInvites = "create-invites",
}

export enum GroupPermissions {
  EditGroup = "edit-group",
  DeleteGroup = "delete-group",
  ManagePosts = "manage-group-posts",
  ManageComments = "manage-group-comments",
  AcceptMemberRequests = "accept-group-member-requests",
  KickMembers = "kick-group-members",
  ManageRoles = "manage-group-roles",
  ManageSettings = "manage-group-settings",
  ManageEvents = "manage-group-events",
  CreateEvents = "create-group-events",
}
