import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {BaseRequestOptions, HttpModule} from "@angular/http";
import {AppRoutingModule} from "./app-routing.module";
import {PageNotFoundComponent} from "./not-found.component";
import {ButtonModule, DataTableModule, InputSwitchModule, InputTextModule, PasswordModule} from "primeng/primeng";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoginComponent} from './login/login.component';
import {AuthGuard} from "./guards/auth.guard";
import {AuthenticationService} from "./service/authentication.service";
import {NavbarComponent} from './navbar/navbar.component';
import {ErrorAlertComponent} from './error-alert/error-alert.component';
import {AdminGuard} from "./guards/admin.guard";
import {UserService} from "./service/user.service";
import {UserListComponent} from './user/user-list/user-list.component';
import {UserDetailsComponent} from './user/user-details/user-details.component';
import {AddUserComponent} from './user/add-user/add-user.component';
import {FamilyListComponent} from './family-list/family-list.component';
import {FamilyDetailsComponent} from './family-details/family-details.component';
import {FamilyService} from "./service/family.service";
import {StudentService} from "./service/student.service";
import {GuardianService} from "./service/guardian.service";

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent,
    NavbarComponent,
    ErrorAlertComponent,
    UserListComponent,
    UserDetailsComponent,
    AddUserComponent,
    FamilyListComponent,
    FamilyDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    DataTableModule,
    InputTextModule,
    PasswordModule,
    InputSwitchModule,
    ButtonModule
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    AuthenticationService,
    BaseRequestOptions,
    FamilyService,
    StudentService,
    GuardianService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
