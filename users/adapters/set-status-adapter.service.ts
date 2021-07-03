import { Injectable } from '@angular/core';
import { IAdapter } from '@auditpro/core/api/adapters/i-adapter';
import { SetStaus } from '../models/get-users.model';
import { SetStatusReq } from '../models/manage-user-req.model';

@Injectable()
export class SetStatusAdapter implements IAdapter<SetStaus> {
  adaptToModel(resp: any): SetStaus {
    return resp;
  }

  adaptFromModel(data: SetStaus) {
    const req = new SetStatusReq();
    req.userid = data.userid;
    req.status = data.status;
    return req;
  }
}
