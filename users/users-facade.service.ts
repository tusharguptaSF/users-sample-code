import {Injectable} from '@angular/core';
import {GetUserCommand} from './commands/get-user.command';
import {ApiService} from '@auditpro/core/api/api.service';
import {GetUsersAdapter} from '../users/adapters/get-users-adapter.service';
import {HttpParams} from '@angular/common/http';
import {GetUsersModel, ManageUser, UserOrgs,SetStaus} from './models/get-users.model';
import {Observable} from 'rxjs';
import {AddUserCommand} from './commands/add-user.command';
import {AddUserAdapter} from './adapters/add-user-adapter.service';
import {EditUserCommand} from './commands/edit-user.command';
import {AnyAdapter} from '@auditpro/core/api/adapters/any-adapter.service';
import {ProfileImageCommand} from './commands/profile-image.command';
import {GetUserByIdCommand} from './commands/get-user-by-id.command';
import {SetUserOrgsCommand} from './commands/set-user-orgs.command';
import {SetUserOrgsAdapter} from './adapters/set-user-orgs-adapter.service';
import {SetStatusCommand} from './commands/set-status.command';
import {SetStatusAdapter} from './adapters/set-status-adapter.service';
import {StatusType} from '@auditpro/core/enums';


@Injectable()
export class UserslistFacadeService {
  constructor(
    private readonly apiService: ApiService,
    private readonly getUsersAdapter: GetUsersAdapter,
    private readonly addUserAdapter: AddUserAdapter,
    private readonly anyAdapter: AnyAdapter,
    private readonly setUserOrgsAdapter: SetUserOrgsAdapter,
    private readonly setStatusAdapter: SetStatusAdapter,

  ) {}

  getUsers(pageSize, pageIndex, filter, sortDirection) {
    const command: GetUserCommand<GetUsersModel> = new GetUserCommand(
      this.apiService,
      this.getUsersAdapter,
    );

    if (filter === '{}') {
      command.parameters = {
        query: new HttpParams()
          .set('limit', pageSize)
          .set('page', pageIndex)
          .set('sort', sortDirection),
      };
    } else {
      command.parameters = {
        query: new HttpParams()
          .set('limit', pageSize)
          .set('page', pageIndex)
          .set('s', filter)
          .set('sort', sortDirection),
      };
    }
    return command.execute();
  }

  addUser(data): Observable<ManageUser> {
    const command: AddUserCommand<ManageUser> = new AddUserCommand(
      this.apiService,
      this.addUserAdapter,
    );
    command.parameters = {
      data: data,
    };
    return command.execute();
  }

  editUser(data, id) {
    const command: EditUserCommand<ManageUser> = new EditUserCommand(
      this.apiService,
      this.addUserAdapter,
      id,
    );
    command.parameters = {
      data: data,
    };
    return command.execute();
  }

  getUserById(id) {
    const command: GetUserByIdCommand<ManageUser> = new GetUserByIdCommand(
      this.apiService,
      this.addUserAdapter,
      id,
    );
    return command.execute();
  }

  uploadProfile(logoUrl) {
    const command: ProfileImageCommand<string> = new ProfileImageCommand(
      this.apiService,
      this.anyAdapter,
    );
    command.parameters = {
      data: logoUrl,
    };
    return command.execute();
  }

  setUserOrgs(data) {
    const command: SetUserOrgsCommand<UserOrgs> = new SetUserOrgsCommand(
      this.apiService,
      this.setUserOrgsAdapter,
    );
    command.parameters = {
      data: data,
    };
    return command.execute();
  }

  setStatus(status:boolean,userId:number){
    const command: SetStatusCommand<SetStaus> = new SetStatusCommand(
      this.apiService,
      this.setStatusAdapter,
    );
    let userStatus;
    if(status){
      userStatus=StatusType.ACTIVE;
    }else{
      userStatus=StatusType.DEACTIVE;
    }
    command.parameters = {
      data: {
        userid:userId,
        status:userStatus
      },
    };
    return command.execute();
  }
}
