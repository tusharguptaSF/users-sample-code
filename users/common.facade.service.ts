import { ApiService } from '@auditpro/core/api/api.service';
import { InMemoryStorageService } from 'ngx-webstorage-service';
import { AnyAdapter } from '@auditpro/core/api/adapters/any-adapter.service';
import { Injectable } from '@angular/core';
import { GetOrganisationsCommand } from '../commands/get-organisations.command';
import { RoleModel } from '../models/role-model';
import { GetRolesCommand } from '../commands/get-roles.command';
import { Observable } from 'rxjs';
import { Dropdown } from '../models/dropdown.model';
import { GetUserOrgsCommand } from '../commands/get-user-orgs.command';
import { UserOrgsDropdown } from '../models/user-orgs-dropdown.model';
import { UserOrgsAdapter } from '@auditpro/shared/adapters/user-orgs-adapter.service';
import { AuditmanagerOrgsAdapter } from '@auditpro/shared/adapters/auditmanager-orgs-adapter.service';
import { OrgsAuditManager } from '../models/orgs-auditmanager.model';
import { AuditmanagerOrgsCommand } from '../commands/orgs-auditmanager.command';
import { HttpParams } from '@angular/common/http';
import { FileConstants } from '@auditpro/core/enums/file.constants';

@Injectable()
export class CommonFacadeService {
  constructor(
    private readonly apiService: ApiService,
    private readonly inMemoryStore: InMemoryStorageService,
    private readonly anyAdapter: AnyAdapter,
    private readonly userOrgsAdapter: UserOrgsAdapter,
    private readonly auditmanagerOrgsAdapter: AuditmanagerOrgsAdapter,
  ) { }

  getOrganisations(): Observable<Dropdown[]> {
    const command: GetOrganisationsCommand<
      Dropdown[]
    > = new GetOrganisationsCommand(this.apiService, this.anyAdapter);
    return command.execute();
  }

  getRoles() {
    const command: GetRolesCommand<RoleModel> = new GetRolesCommand(
      this.apiService,
      this.anyAdapter,
    );
    return command.execute();
  }

  userOrgsDropdown(id): Observable<UserOrgsDropdown[]> {
    const command: GetUserOrgsCommand<UserOrgsDropdown> = new GetUserOrgsCommand(
      this.apiService,
      this.userOrgsAdapter,
      id,
    );
    return command.execute();
  }

  getOrgsDashboardUsers(filterArray = {}) {
    const command: AuditmanagerOrgsCommand<OrgsAuditManager> = new AuditmanagerOrgsCommand(
      this.apiService,
      this.auditmanagerOrgsAdapter,
    );
    command.parameters = {
      query: new HttpParams()
        .set('s', JSON.stringify(filterArray))
    };
    return command.execute();
  }

  /**
   * readAsDataURL function
   *
   * @return get uploaded image dimensions.
   */
  async readAsDataURL(file) {
    // return new promise.
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // load image.
      reader.addEventListener("load", function () {
        const img = document.createElement("img");

        // get image width and height on load.
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });

        img.src = reader.result as string;
      }, false);
      reader.readAsDataURL(file);
    });
  }

  /**
   * checkValidUploadeImage function
   *
   * created due to: 1 duplicated blocks of code must be removed.
   *
   * @return check uploaded image is in defined dimensions for user logo..
   */
  async checkValidUploadeImage(filesUploaded) {
    // get uploaded image dimensions.
    const images = await Promise.all(
      filesUploaded.map(f =>
        this.readAsDataURL(f)
      )
    );

    let valid = true;

    // check uploaded image width should not be more than defined user logo width.
    if (typeof images[0] !== "undefined" && typeof images[0]['width'] !== "undefined" && images[0]['width'] > FileConstants.USER_LOGO_WIDTH) {
      valid = false;
    }

    // check uploaded image height should not be more than defined user logo height.
    if (typeof images[0] !== "undefined" && typeof images[0]['height'] !== "undefined" && images[0]['height'] > FileConstants.USER_LOGO_HEIGHT) {
      valid = false;
    }

    return valid;
  }
}
