import {
  Component,
  ElementRef,
  AfterViewInit,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UserslistFacadeService } from '../users-facade.service';
import { UsersDataSource } from '../users.datasource';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';
import { CommonFacadeService } from '@auditpro/shared/facades/common.facade.service';
import { Router } from '@angular/router';
import { UserSessionStoreService as StoreService } from '@auditpro/core/store/user-session-store.service';
import { RoleType } from '@auditpro/core/enums/roles.enum';
import { ToastrService } from 'ngx-toastr';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { Shared } from '@auditpro/core/library/shared';


export interface PeriodicElement {
  firstName: string;
  org: string;
  role: string;
  email: string;
  status: string;
}

@Component({
  selector: 'auditpro-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UsersListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'firstName',
    'org.name',
    'role.name',
    'email',
    'status.name',
    'action',
  ];

  dataSource: UsersDataSource;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('input', { static: false }) input: ElementRef;
  hideOrganization = false;
  isHidden = false;
  showEdit: boolean;
  orgAdmin: string;
  positionOptions: TooltipPosition[] = ['above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);
  constructor(
    private readonly userslistService: UserslistFacadeService,
    private readonly commonService: CommonFacadeService,
    private readonly router: Router,
    private readonly store: StoreService,
    private readonly toastr: ToastrService,
    public readonly shared: Shared,
  ) {
    this.showEdit = false;
  }

  orgsList: object;
  roleList: object;
  selectedUser: number;
  selectedStatus: number;
  selectedOrg: number;

  ngOnInit(): void {
    const pageLimit = 10;
    this.dataSource = new UsersDataSource(this.userslistService);
    this.dataSource.loadUsers('{}', 'firstName,ASC', 0, pageLimit);
    this.commonService.getRoles().subscribe(res => {
      if (res) {
        this.roleList = res;
      }
    });
    this.commonService.getOrganisations().subscribe(res => {
      if (res) {
        this.orgsList = res;
      }
    });
    if (
      this.store.getUser() &&
      this.store.getUser().role !== RoleType.PortalAdmin
    ) {
      this.displayedColumns.splice(1, 1);
      this.hideOrganization = true;
    } else {
      this.isHidden = true;
    }
    if (this.store.getUser().role === RoleType.PortalAdmin) {
      this.showEdit = true;
    }
    this.orgAdmin = RoleType.OrgAdmin;
  }

  ngAfterViewInit() {
    const bounceTime = 150;
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(bounceTime),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadUserPage();
        }),
      )
      .subscribe();
    /** reset the paginator after sorting */
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    /** on sort or paginate events, load a new page */
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadUserPage()))
      .subscribe();
  }

  loadUserPage() {
    const expressionArray = {};

    if (this.input.nativeElement.value !== '') {
      const name = this.input.nativeElement.value.split(' ');
      expressionArray['firstName'] = { $contL: name[0] };
      if (typeof name[1] !== undefined) {
        expressionArray['lastName'] = { $contL: name[1] };
      }
    }
    if (this.selectedUser) {
      expressionArray['role.id'] = `${this.selectedUser}`;
    }
    if (this.selectedStatus) {
      expressionArray['status.id'] = `${this.selectedStatus}`;
    }
    if (this.selectedOrg) {
      expressionArray['userOrgs.orgId'] = `${this.selectedOrg}`;
    }
    const expression = JSON.stringify(expressionArray);
    const pageNo =
      this.input.nativeElement.value !== ''
        ? this.paginator.pageIndex
        : this.paginator.pageIndex + 1;

    this.dataSource.loadUsers(
      expression,
      `${this.sort.active},${this.sort.direction.toUpperCase()}`,
      pageNo,
      this.paginator.pageSize,
    );
  }

  resetUserGridFilters(): void {
    this.input.nativeElement.value = '';
    this.selectedUser = undefined;
    this.selectedOrg = undefined;
    this.selectedStatus = undefined;
    this.loadUserPage();
  }

  cellClicked(element) {
    this.router.navigate([`/main/users/edit-user/${element.id}`]);
  }

  /**
   * onChangeStatus function
   *
   * @return change the status of user, set error on error.
   */
  onChangeStatus(event, userId) {
    // call user setStatus api.
    this.userslistService.setStatus(event['checked'], userId).subscribe(res => {
      // check for api success message.
      if (res && res['error'] === false) {
        // set success message.
        this.toastr.success(res.message, "Success");
      }
      else if (res && res['error'] === true) {
        // error from api, slide back the active/deactive toggle.
        event.source.checked = true;

        // set error message.
        this.toastr.error(res.message, "error");
      }
      else {
        // for sonar issue.
        /** Do Nothing. */
      }
    });
  }

  /**
   * export function
   *
   * @return get various filter value, json stringify them and hit service method to call the api.
   */
  export(mode) {
    // create sort and direction array.
    const sortArray = {
      'firstName': 'users.first_name',
      'role.name': 'mr.name',
      'email': 'users.email',
      'status.name': 'ms.name',
      'org.name': 'org.name',
    };

    const dirArray = {
      'desc': "DESC",
      'asc': "ASC"
    };

    // get name, role, organisations and status.
    const name = ((document.getElementById("name") as HTMLInputElement).value);
    const role = this.selectedUser;
    const org = this.selectedOrg;
    const userStatus = this.selectedStatus;

    // create requestJson with type loans.
    const requestJson = {
      "type": "users",
      "as": mode
    };

    // set sort and direction.
    requestJson['sort'] = typeof sortArray[this.sort.active] !== "undefined"
      ? sortArray[this.sort.active] : "id";
    requestJson['direction'] = typeof dirArray[this.sort.direction] !== "undefined"
      ? dirArray[this.sort.direction] : "DESC";

    // check name.
    if (typeof name !== 'undefined') {
      // add name to json.
      requestJson['name'] = name;
    }

    // check role.
    if (typeof role !== 'undefined') {
      // add role to json.
      requestJson['role'] = role;
    }

    // check org.
    if (typeof org !== 'undefined') {
      // add org to json.
      requestJson['org'] = org;
    }

    // check userStatus.
    if (typeof userStatus !== 'undefined') {
      // add userStatus to json.
      requestJson['userStatus'] = userStatus;
    }

    // JSON.stringify request json.
    const passJsonString = JSON.stringify(requestJson);

    // hit download report api.
    this.shared.getDownloadReport(passJsonString).subscribe(async res => {
      if (res) {
        // success message.
        this.toastr.success(res.message, "SUCCESS!");
      }
    });
  }
}
