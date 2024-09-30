import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() data: any;

  headerText: string = '';
  ngOnInit(): void {
    this.headerText = this.data;
  }
}
