import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {UsersListComponent} from './users-list/users-list.component';
import {UsersAddEditComponent} from './users-add-edit/users-add-edit.component';

const routes: Routes = [
  {
    path: '',
    component: UsersListComponent,
  },
  {
    path: 'add-user',
    component: UsersAddEditComponent,
  },
  {
    path: 'edit-user/:id',
    component: UsersAddEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
