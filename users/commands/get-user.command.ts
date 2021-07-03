import { IAdapter } from "@auditpro/core/api/adapters/i-adapter";
import { ApiService } from "@auditpro/core/api/api.service";
import { GetListAPIObjectCommand } from "@auditpro/core/api/commands/get-list-api-object.command";
import { environment } from "@auditpro/env/environment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { OptionModel } from '../models/option-model';

export class GetUserCommand<T> extends GetListAPIObjectCommand<T> {
  constructor(apiService: ApiService, adapter: IAdapter<T>) {
    super(apiService, adapter, `${environment.baseUrl}/users`);
  }
  execute(): Observable<T> {
    const options : OptionModel= { observe: "body" };
    if (this.parameters) {
      if (this.parameters.headers) {
        options.headers = this.parameters.headers;
      }

      if (this.parameters.query) {
        options.params = this.parameters.query;
      }
    }
    return this.apiService
      .get(this.uri, options)
      .pipe(
        map(
          resp =>
           this.adapter.adaptToModel(resp.users)
        )
      );
  }
}
