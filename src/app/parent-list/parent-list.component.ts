import { Component, OnInit } from '@angular/core';
import {Parent} from "./parent";
import {DataService} from "../data.service";

@Component({
  selector: 'app-parent-list',
  templateUrl: './parent-list.component.html',
  styleUrls: ['./parent-list.component.css']
})
export class ParentListComponent implements OnInit {
  parents: Parent[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.parents = [];
    this.getParents();
  }

  getParents(): void {
    this.dataService.getParents().then(parents => {
      this.parents = parents.json().parents;
    })
  }
}
