import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

export interface buttonValues {
  label: string;
  path: string;
}

export class navigation {
  constructor(
    protected location: Location,
    protected route: Router,
    protected actRoute: ActivatedRoute
  ) {}

  /* BUTTON NAVIGATION VALUES */
  buttonStatus = [
    { label: 'home', path: '/apps/home' },
    { label: 'calendar', path: '/apps/calendar' },
    { label: 'task', path: '/apps/task' },
    { label: 'clock', path: '/apps/clock' },
  ];

  public valuePath: string | null = '/apps/home';

  /* CHANGE ROUTE */
  public navigateRoute(button: buttonValues) {
    this.valuePath = button.path;

    this.route.navigate([button.label], { relativeTo: this.actRoute });
  }
}
