import {PostAPICommand} from '@auditpro/core/api/commands/post-api.command';
import {IAdapter} from '@auditpro/core/api/adapters/i-adapter';
import {ApiService} from '@auditpro/core/api/api.service';
import {environment} from '@auditpro/env/environment';

export class SetStatusCommand<T> extends PostAPICommand<T> {
  constructor(apiService: ApiService, anyAdapter: IAdapter<T>) {
    super(apiService, anyAdapter, `${environment.baseUrl}/users/setstatus`);
  }
}
