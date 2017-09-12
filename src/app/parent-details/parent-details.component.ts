import {Component, Input, OnInit} from '@angular/core';
import {Parent} from "../parent-list/parent";
import {Child} from "./child";
import {DataService} from "../data.service";
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common';

@Component({
  selector: 'app-parent-details',
  templateUrl: './parent-details.component.html',
  styleUrls: ['./parent-details.component.css']
})
export class ParentDetailsComponent implements OnInit {
  @Input() parent: Parent = new Parent();

  children: Child[] = [];

  constructor(private dataService: DataService, private route: ActivatedRoute, private location: Location) {
  }

  ngOnInit(): void {
    this.getParentAndChildren(this.route.snapshot.params['id']);

  }

  getParentAndChildren(parentId: number) {
    this.dataService.getParent(parentId).then(parent => {
      this.parent = parent.json();
      for (let i in this.parent.enrolledChildren) {
        this.dataService.getChild(+this.parent.enrolledChildren[i]).then(child => {
          this.children.push(child.json());
        })
      }
    })
  }

}
