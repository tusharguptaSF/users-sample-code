import { Injectable } from '@angular/core';
import { IAdapter } from '@auditpro/core/api/adapters/i-adapter';
import { UserOrgs } from '../models/get-users.model';
import { UserOrgsReq } from '../models/manage-user-req.model';

@Injectable()
export class SetUserOrgsAdapter implements IAdapter<UserOrgs> {
  adaptToModel(resp: any): UserOrgs {
    return resp.returned.message;
  }

  adaptFromModel(data: UserOrgs) {
    const req = new UserOrgsReq();
    req.orgids = data.orgIds;
    req.userid = data.userId;
    return req;
  }
}
