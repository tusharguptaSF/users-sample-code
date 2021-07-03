import { Injectable } from '@angular/core';
import { GetUsersModel } from '../models/get-users.model';
import { IAdapter } from '../../../core/api/adapters/i-adapter';

@Injectable()
export class GetUsersAdapter implements IAdapter<GetUsersModel> {
  adaptToModel(resp: any): GetUsersModel {
    const user = new GetUsersModel();
    user.data = resp.data;
    user.total = resp.total;
    return user;
  }
  adaptFromModel(data: GetUsersModel) {
    /** Sonar issue solution. */
    /** Do Nothing. */
  }
}
