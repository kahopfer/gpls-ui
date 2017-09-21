import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PageNotFoundComponent} from "./not-found.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./guards/auth.guard";
import {AdminGuard} from "./guards/admin.guard";
import {UserListComponent} from "./user/user-list/user-list.component";
import {AddUserComponent} from "./user/add-user/add-user.component";
import {FamilyListComponent} from "./family-list/family-list.component";
import {FamilyDetailsComponent} from "./family-details/family-details.component";
import {UserProfileComponent} from "./user/user-profile/user-profile.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/family-list',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'family-list',
    component: FamilyListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'family-details/:id',
    component: FamilyDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'create-user',
    component: AddUserComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'profile/:username',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
