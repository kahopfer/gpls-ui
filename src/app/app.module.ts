import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {BaseRequestOptions, HttpModule} from "@angular/http";
import {AppRoutingModule} from "./app-routing.module";
import {PageNotFoundComponent} from "./not-found.component";
import {DataService} from "./service/data.service";
import {ButtonModule, DataTableModule, InputSwitchModule, InputTextModule, PasswordModule} from "primeng/primeng";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoginComponent} from './login/login.component';
import {AuthGuard} from "./guards/auth.guard";
import {AuthenticationService} from "./service/authentication.service";
import {NavbarComponent} from './navbar/navbar.component';
import {ErrorAlertComponent} from './error-alert/error-alert.component';
import {AdminGuard} from "./guards/admin.guard";
import {UsersService} from "./service/users.service";
import {UserListComponent} from './user/user-list/user-list.component';
import {UserDetailsComponent} from './user/user-details/user-details.component';
import {AddUserComponent} from './user/add-user/add-user.component';
import {FamilyListComponent} from './family-list/family-list.component';
import {FamilyDetailsComponent} from './family-details/family-details.component';

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
    DataService,
    UsersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
