import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { userPomoConfig } from '../../../../interfaces/pomoPal';
import { PomoTaskConfigService } from '../service/pomo-task-config.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export class PomodoroConfiguration {
  constructor(protected configService: PomoTaskConfigService) {}

  public destroyRef = inject(DestroyRef);

  public fetchUserConfig = () => {
    return this.configService.userConfig$.pipe(
      map((value) => value),
      catchError((err) => {
        console.error(err);
        return of(undefined);
      }),
      takeUntilDestroyed(this.destroyRef)
    );
  };

  /*insert if there is no existing config */
  public insertNewConfig = async (id: number) => {
    const defaultData: userPomoConfig = {
      userId: id,
      pomodoro: 1500,
      shortBreak: 300,
      longBreak: 900,
      longBreakAfter: 4,
      music: 0,
    };

    const result = await this.configService.insertUserConfig(defaultData);
  };

  public updateConfig = async (data: userPomoConfig) => {
    const result = await this.configService.updateUserConfig(
      data.configId!,
      data
    );
  };
}

export class Conversion {
  public convertSecToMin = (seconds: number) => {
    const SecondsInAMinute = 60;
    return seconds / SecondsInAMinute;
  };

  public convertMinToSeconds = (minutes: number) => {
    const SecondsInAMinute = 60;
    return minutes * SecondsInAMinute;
  };
}
