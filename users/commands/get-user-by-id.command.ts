import {ApiService} from '@auditpro/core/api/api.service';
import {IAdapter} from '@auditpro/core/api/adapters/i-adapter';
import {environment} from '@auditpro/env/environment';
import {GetAPICommand} from '@auditpro/core/api/commands/get-api.command';

export class GetUserByIdCommand<T> extends GetAPICommand<T> {
  constructor(apiService: ApiService, adapter: IAdapter<T>, userId: number) {
    super(apiService, adapter, `${environment.baseUrl}/users/${userId}`);
  }
}
