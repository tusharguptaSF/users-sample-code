import {ApiService} from '@auditpro/core/api/api.service';
import {IAdapter} from '@auditpro/core/api/adapters/i-adapter';
import {environment} from '@auditpro/env/environment';
import {PatchAPICommand} from '@auditpro/core/api/commands/patch-api.command';

export class EditUserCommand<T> extends PatchAPICommand<T> {
  constructor(apiService: ApiService, adapter: IAdapter<T>, userId: number) {
    super(apiService, adapter, `${environment.baseUrl}/users/${userId}`);
  }
}
