import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { headerType } from '../../components/header/header.component';
import { ScheduleService } from '../../database/schedule.service';
import { Schedule } from '../../database/db';
import { ModalType, PopModalService } from '../../service/pop-modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-class-sched',
  templateUrl: './class-sched.component.html',
  styleUrl: './class-sched.component.scss',
})
export class ClassSchedComponent implements OnInit {
  ngOnInit(): void {
    this.fetchSchdule();
    this.fetchModalStatus();
  }
  public schedule = inject(ScheduleService);
  public modal = inject(PopModalService);
  public destroyRef = inject(DestroyRef);

  public homeHeaderData: headerType = {
    type: 'Class Schedule',
    isHome: true,
  };
  public schedList: Schedule[] = [];
  public isErrorExist: ModalType = ModalType.NONE;
  public modalType = ModalType;
  public noSchedMessage = {
    imgPath: '/extra/remove.png',
    title: 'No Schedule Selected',
    subText: 'Please select a schedule to generate..',
  };
  public fetchSchdule = async () => {
    const result = await this.schedule.getAllClassSched();

    this.schedList = result;
  };

  public schedSelected: number[] = []; // SCHED ID;
  public selectSched = (schedId: number) => {
    /* -1 is the result oif didn't exists */
    const schedExists = this.schedSelected.findIndex(
      (sched) => sched === schedId
    );
    if (schedExists === -1) {
      this.schedSelected.push(schedId);
    } else {
      this.schedSelected.splice(schedExists, 1);
    }
  };

  public setSelectedSched = (schedId: number) => {
    return this.schedSelected.find((sched) => sched === schedId) != undefined
      ? 'selected'
      : '';
  };

  public generateSched = () => {
    if (this.schedSelected.length === 0) {
      this.isErrorExist = ModalType.INCORRECT;
    }
  };

  public fetchModalStatus = () => {
    this.modal
      .getModalStatus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.isErrorExist = value;
      });
  };
}
