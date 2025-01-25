import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrl: './on-boarding.component.scss',
})
export class OnBoardingComponent {
  public route = inject(Router);
  public actRoute = inject(ActivatedRoute);
  public currentIndex: number = 0;
  public onBoardingData: { img: string; title: string; text: string }[] = [
    {
      img: 'calendar.gif',
      title:
        'Master your tasks with ease! Organize, schedule, and crush your goals—one step at a time.',
      text: ` Achieve more, stress less—FocusPal keeps you on track and motivated!`,
    },
    {
      img: 'Chat bot.gif',
      title:
        'Let AI turn your words into action! Speak or type, and Sydney will do the rest.',
      text: ` Achieve more, stress less—FocusPal keeps you on track and motivated!`,
    },
    {
      img: 'success.gif',
      title:
        'Boost your productivity and climb the leaderboard! Compete, rank up, and stay motivated.',
      text: ` Achieve more, stress less—FocusPal keeps you on track and motivated!`,
    },
  ];

  public setImagePath = (index: number) => {
    return `/characters/${this.onBoardingData[index].img}`;
  };

  public next = () => {
    if (this.currentIndex < 2) {
      this.currentIndex++;
    } else {
      this.route.navigate(['../../auth/login'], { relativeTo: this.actRoute });
    }
  };

  public skipOnboarding = () => {
    this.route.navigate(['../../auth/login'], { relativeTo: this.actRoute });
  };
}
