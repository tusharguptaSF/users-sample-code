import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UsersListComponent } from './users-list/users-list.component';
import { ThemeModule } from '../../theme/theme.module';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { UserslistFacadeService } from './users-facade.service';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersAddEditComponent } from './users-add-edit/users-add-edit.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { GetUsersAdapter } from '../users/adapters/get-users-adapter.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddUserAdapter } from './adapters/add-user-adapter.service';
import { SetUserOrgsAdapter } from './adapters/set-user-orgs-adapter.service';
import { SetStatusAdapter } from './adapters/set-status-adapter.service';
import { ReportsAdapter } from '@auditpro/core/api/adapters/reports-adapter.service';
import { Shared } from '@auditpro/core/library/shared';
import { NgKnifeModule } from 'ng-knife';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [UsersListComponent, UsersAddEditComponent],

  imports: [
    CommonModule,
    UsersRoutingModule,
    ThemeModule.forRoot(),
    SharedModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    NgxDropzoneModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    NgKnifeModule,
    MatButtonToggleModule
  ],
  exports: [
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    NgxDropzoneModule,
  ],
  providers: [
    GetUsersAdapter,
    UserslistFacadeService,
    AddUserAdapter,
    SetUserOrgsAdapter,
    SetStatusAdapter,
    Shared,
    ReportsAdapter
  ],
})
export class UsersModule { }
