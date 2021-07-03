import {PostAPICommand} from '@auditpro/core/core.module';
import {ApiService} from '@auditpro/core/api/api.service';
import {IAdapter} from '@auditpro/core/api/adapters/i-adapter';
import {environment} from '@auditpro/env/environment';

export class ProfileImageCommand<T> extends PostAPICommand<T> {
  constructor(apiService: ApiService, adapter: IAdapter<T>) {
    super(apiService, adapter, `${environment.baseUrl}/fileupload/image`);
  }
}
