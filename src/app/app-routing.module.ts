import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PageNotFoundComponent} from "./not-found.component";
import {EmployeesComponent} from "./employees/employees.component";
import {ParentListComponent} from "./parent-list/parent-list.component";
import {ParentDetailsComponent} from "./parent-details/parent-details.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/parent-list',
    pathMatch: 'full'
  },
  {
    path: 'parent-list',
    component: ParentListComponent
  },
  {
    path: 'parent-details/:id',
    component: ParentDetailsComponent
  },
  {
    path: 'employees',
    component: EmployeesComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
