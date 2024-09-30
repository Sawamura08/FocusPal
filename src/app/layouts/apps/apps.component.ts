import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

enum buttons {
  HOME,
  CALENDAR,
  CHECK_LIST,
  CLOCK,
}
@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrl: './apps.component.scss',
})
export class AppsComponent {
  constructor(private route: Router, private actRoute: ActivatedRoute) {}
  buttonStatus = [
    { status: buttons.HOME, label: 'apps' },
    { status: buttons.CALENDAR, label: 'calendar' },
    { status: buttons.CHECK_LIST, label: 'checkList' },
    { status: buttons.CLOCK, label: 'clock' },
  ];
  valueStatus: buttons = buttons.HOME;

  public navigate = (button: { status: buttons; label: string }) => {
    this.valueStatus = button.status;

    this.route.navigate([button.label], { relativeTo: this.actRoute });
  };

  public buttonStyle = (status: buttons) => {
    return this.valueStatus === status ? 'selected' : '';
  };
}
