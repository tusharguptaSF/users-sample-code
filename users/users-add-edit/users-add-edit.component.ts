import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RouteComponentBase } from '@auditpro/core/route-component-base';
import { ManageUser, UserOrgs } from '../models/get-users.model';
import { UserslistFacadeService } from '../users-facade.service';
import { Location } from '@angular/common';
import { environment } from '@auditpro/env/environment';
import { CommonFacadeService } from '@auditpro/shared/facades/common.facade.service';
import { FileConstants } from '../../../core/enums/file.constants';
import { UserSessionStoreService as StoreService } from '@auditpro/core/store/user-session-store.service';
import { RoleType } from '@auditpro/core/enums/roles.enum';
import { UserOrgsDropdown } from '@auditpro/shared/models/user-orgs-dropdown.model';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'auditpro-users-add-edit',
  templateUrl: './users-add-edit.component.html',
  styleUrls: ['./users-add-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UsersAddEditComponent extends RouteComponentBase {
  files: File;
  users: ManageUser;
  userId: string;
  org: object;
  roles: object;
  title = 'Add User';
  userImage: string;
  hideOrganization = false;
  multiSelect = false;
  userOrgs: UserOrgs;
  multiOrgs: string;
  userOrgIds: UserOrgsDropdown[];
  showUnlock = false;
  filesUploaded;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly userListService: UserslistFacadeService,
    protected readonly route: ActivatedRoute,
    protected readonly location: Location,
    private readonly toastr: ToastrService,
    private readonly commonService: CommonFacadeService,
    private readonly router: Router,
    private readonly store: StoreService,
  ) {
    super(route, location);
  }

  ngOnInit() {
    this.users = new ManageUser();
    this.users.status = 1;
    this.userId = this.getRouteParam('id');
    this.getDropdownData();
    if (this.userId) {
      this.title = 'Edit User';

      this.getUserById();
    }
    if (
      this.store.getUser() &&
      this.store.getUser().role !== RoleType.PortalAdmin
    ) {
      this.hideOrganization = true;
      this.users.org = this.store.getUser().org;
    }
  }

  async uploadImage(event) {
    if (event.rejectedFiles && event.rejectedFiles.length > 0) {
      if (event.rejectedFiles[0].size > FileConstants.MAXIMUM_IMAGE_SIZE) {
        this.toastr.warning(
          'Maximum image size allowed is 2 MB.',
          'Exceeding image size!',
          {
            timeOut: environment.messageTimeout,
          },
        );
      } else {
        this.toastr.warning(
          'You can only import an image.',
          'Invalid File Type!',
          {
            timeOut: environment.messageTimeout,
          },
        );
      }
    } else {
      this.filesUploaded = this.files = event.addedFiles;
      const formData = new FormData();

      // created due to: 1 duplicated blocks of code must be removed.
      // check uploaded image is in defined dimensions for user logo.
      const valid = await this.commonService.checkValidUploadeImage(this.filesUploaded);

      // if uploaded image file is not a valid image, ie either image width is more than defined
      // width or image height is more than defined height.
      if (!valid) {
        // make uploaded array as blank.
        this.files = null;

        // show warning.
        this.toastr.warning(
          `User logo should be max ${FileConstants.USER_LOGO_WIDTH}X${FileConstants.USER_LOGO_HEIGHT} px`,
          'Exceeding image dimensions!',
          {
            timeOut: environment.messageTimeout,
          },
        );
      } else {
        formData.append('uploadimage', this.files[0]);
        this._subscriptions.push(
          this.userListService.uploadProfile(formData).subscribe(res => {
            this.users.profileImage = res;
          }),
        );
      }
    }
  }

  onRemove(event) {
    this.files = null;
  }

  addEditUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.userId) {
      if (
        this.multiSelect &&
        typeof this.users.org2 !== 'undefined' &&
        this.users.org2.length > 1
      ) {
        this.multiOrgs = this.users.org2;
        this.users.org = null;
        this.users.org2 = null;
      }
      this.userListService.editUser(this.users, this.userId).subscribe(res => {
        if (res) {
          this.toastr.success('User Updated Succesfully', 'SUCCESS !', {
            timeOut: environment.messageTimeout,
          });
          this.validateUserOrgs(res.id);
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/main/users'], { relativeTo: this.route });
        }
      });
    } else {
      if (
        this.multiSelect &&
        typeof this.users.org2 !== 'undefined' &&
        this.users.org2.length > 1
      ) {
        this.multiOrgs = this.users.org2;
        this.users.org2 = null;
      }
      this._subscriptions.push(
        this.userListService.addUser(this.users).subscribe(res => {
          if (res) {
            this.toastr.success('User Added Successfullly', 'SUCCESS!', {
              timeOut: environment.messageTimeout,
            });
            this.validateUserOrgs(res.id);
            this.router.navigate([`/main/users`]);
          }
        }),
      );
    }
  }

  validateUserOrgs(id) {
    if (
      this.multiSelect &&
      typeof this.multiOrgs !== 'undefined' &&
      this.multiOrgs.length > 1
    ) {
      this.setUserOrgs(id);
      return true;
    }
    return false;
  }

  getUserById() {
    const roleId1 = 3;
    const roleId2 = 4;
    this._subscriptions.push(
      this.userListService.getUserById(this.userId).subscribe(res => {
        if (res) {
          this.users = res;
          this.showHideLockButton(res);
          this.userImage = res.profileImage;
          if (
            (this.users.role === roleId1 || this.users.role === roleId2) &&
            this.users.org &&
            this.users.userOrgs
          ) {
            var arr1 = [];
            this.onRoleChange(this.users.role);
            arr1.push(this.users.userOrgs);
            this.users.org2 = arr1;
          }
          if (this.users.org === null) {
            this.onRoleChange(this.users.role);
          }
          if (
            (this.users.role === roleId1 || this.users.role === roleId2) &&
            this.users.org === null
          ) {
            this._subscriptions.push(
              this.commonService
                .userOrgsDropdown(this.userId)
                .subscribe(resp => {
                  if (resp) {
                    var arr = [];
                    resp.forEach(ele => {
                      arr.push(ele.id);
                    });
                    this.users.org2 = arr;
                  }
                }),
            );
          }
        }
      }),
    );
  }

  getDropdownData() {
    this._subscriptions.push(
      this.commonService.getOrganisations().subscribe(res => {
        this.org = res;
      }),
    );
    this._subscriptions.push(
      this.commonService.getRoles().subscribe(res => {
        this.roles = res;
      }),
    );
  }

  onRoleChange(roleId) {
    const roleId1 = 3;
    const roleId2 = 4;
    if (roleId === roleId1 || roleId === roleId2) {
      this.multiSelect = true;
    } else {
      this.multiSelect = false;
    }
  }

  setUserOrgs(usersId) {
    this.userOrgs = new UserOrgs();
    this.userOrgs.userId = parseInt(usersId);
    this.userOrgs.orgIds = this.multiOrgs;
    this.userListService.setUserOrgs(this.userOrgs).subscribe(res => {
      if (res) {
        this.toastr.success(
          `${this.users.firstNm} assigned to multiple organizations`,
          'SUCCESS!',
          {
            timeOut: environment.messageTimeout,
          },
        );
      }
    });
  }

  unlock(event) {
    if (event.value === "null") {
      this.users.loginAttempt = null;
    } else {
      this.users.loginAttempt = event.value;
    }
    return true;
  }

  showHideLockButton(res) {
    if (res.loginAttempt >= environment.loginAttempt) {
      this.showUnlock = true;
    } else {
      delete this.users.loginAttempt;
      this.showUnlock = false;
    }
  }
}
