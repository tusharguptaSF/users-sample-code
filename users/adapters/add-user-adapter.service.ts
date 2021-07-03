import { Injectable } from '@angular/core';
import { IAdapter } from '@auditpro/core/api/adapters/i-adapter';
import { ManageUser } from '../models/get-users.model';
import { ManageUserReq } from '../models/manage-user-req.model';

@Injectable()
export class AddUserAdapter implements IAdapter<ManageUser> {
  adaptToModel(resp: any): ManageUser {
    const users = new ManageUser();
    users.firstNm = resp.user.firstName;
    users.lastNm = resp.user.lastName;
    users.email = resp.user.email;
    users.id = resp.user.id;
    users.status = resp.user.status.id;
    users.role = resp.user.role.id;
    users.org = resp.user.org ? resp.user.org.id : resp.user.org;
    users.profileImage = resp.user.profileImage;
    users.loginAttempt = resp.user.loginAttempt;
    users.userOrgs =
      typeof resp.user.userOrgs !== 'undefined' && resp.user.userOrgs.length > 0
        ? resp.user.userOrgs[0].orgId.id
        : null;
    return users;
  }

  adaptFromModel(data: ManageUser) {
    const req = new ManageUserReq();
    req.firstName = data.firstNm;
    req.lastName = data.lastNm ? data.lastNm : '';
    req.email = data.email;
    req.org = data.org2 ? parseInt(data.org2) : data.org;
    req.role = data.role;
    req.status = data.status;
    req.profileImage = data.profileImage;
    req.loginAttempt = data.loginAttempt;
    return req;
  }
}
