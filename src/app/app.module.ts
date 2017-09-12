import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppRoutingModule} from "./app-routing.module";
import {PageNotFoundComponent} from "./not-found.component";
import { EmployeesComponent } from './employees/employees.component';
import {DataService} from "./data.service";
import { ParentListComponent } from './parent-list/parent-list.component';
import { ParentDetailsComponent } from './parent-details/parent-details.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    EmployeesComponent,
    ParentListComponent,
    ParentDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
