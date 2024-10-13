import { Component, Input, OnInit } from '@angular/core';

export interface headerType {
  type: string;
  isHome: boolean;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() data: any;
  @Input() homeData: headerType | null = null;

  headerText: string | undefined = '';
  public home: any;
  ngOnInit(): void {
    this.checkHeaderType();
  }

  private checkHeaderType = () => {
    this.headerText = this.data;

    if (!this.headerText) {
      this.home = this.homeData?.isHome;
      this.headerText = this.homeData?.type;
    }
  };

  /* hamburger MENU */
  public spanArr: string[] = ['1', '2', '3'];
  public toggle: boolean = false;
  public toggleMenu = () => {
    this.toggle = !this.toggle;
    console.log(this.toggle);
  };
}
