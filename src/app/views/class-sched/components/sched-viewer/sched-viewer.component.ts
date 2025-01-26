import { Component, inject, Input, OnInit } from '@angular/core';
import { PopModalService } from '../../../../service/pop-modal.service';
import { Schedule } from '../../../../database/db';
import { screenshot } from '../../../../components/gamified-completion-modal/screenshot';
import { slideRight } from '../../../../animation/slide-right.animate';

@Component({
  selector: 'app-sched-viewer',
  templateUrl: './sched-viewer.component.html',
  styleUrl: './sched-viewer.component.scss',
  animations: [slideRight],
})
export class SchedViewerComponent implements OnInit {
  constructor() {
    this.screenshot = new screenshot();
  }
  ngOnInit(): void {
    this.permanentSchedList = [...this.schedList];
  }

  public popModal = inject(PopModalService);
  public screenshot: screenshot;
  public isScreenshotClick: boolean = false;
  public isAnimated: boolean = true;
  // this variable is use since the @Input become zero due to classSched reset
  public permanentSchedList: Schedule[] = [];
  @Input() schedList: Schedule[] = [];

  public closeModal = () => {
    this.isAnimated = false;
    setTimeout(() => {
      this.isAnimated = true;
      this.popModal.closeModal();
    }, 300);
  };

  // check if the sched exist on etc. Monday
  public isSchedInDays = (schedDay: number[], currentDay: number) => {
    return schedDay.includes(currentDay);
  };

  /* CHECK IF THE DAY HAS A SCHED */
  public checkScheduledDay = (currentDay: number) => {
    return this.permanentSchedList.some((sched) =>
      sched.daysOfWeek?.includes(currentDay)
    );
  };

  public downloadSched = () => {
    this.isScreenshotClick = true;
    setTimeout(() => {
      this.screenshot.captureElement('#screenshot');
      this.isScreenshotClick = false;
    }, 300);
  };
}
