import { Component } from '@angular/core';
import { animationStart } from './animation';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrl: './starter.component.scss',
  animations: [animationStart],
})
export class StarterComponent {
  constructor(private route: Router, private actRoute: ActivatedRoute) {}

  routeToWelcome = () => {
    setTimeout(() => {
      this.route.navigate(['../welcome'], { relativeTo: this.actRoute });
    }, 1000);
  };
}
