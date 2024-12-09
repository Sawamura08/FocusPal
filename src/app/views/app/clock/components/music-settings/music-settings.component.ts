import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  musicConfig,
  musicIcon,
  userPomoConfig,
} from '../../../../../interfaces/pomoPal';
import { PomodoroConfiguration } from '../../class/config';
import { PomoTaskConfigService } from '../../service/pomo-task-config.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-music-settings',
  templateUrl: './music-settings.component.html',
  styleUrl: './music-settings.component.scss',
})
export class MusicSettingsComponent implements OnInit, OnDestroy {
  constructor(protected configService: PomoTaskConfigService) {
    this.config = new PomodoroConfiguration(configService);
  }

  ngOnInit(): void {
    this.fetchUserConfig();
  }

  public musicObject = musicConfig;
  public musicIcons = musicIcon;
  public config: PomodoroConfiguration;
  public destroyRef = inject(DestroyRef);

  public setMusicIcon = (index: number): string => {
    return this.musicIcons[index];
  };

  public userConfig: userPomoConfig | undefined;
  public selectedMusic: number = 0;
  public selectMusic = async (index: number) => {
    this.selectedMusic = index;

    if (this.userConfig != undefined) {
      const copyUserConfig = structuredClone(this.userConfig);
      // IF index != 0 then decrement to match the music name then 0 if none
      copyUserConfig.music = index;

      await this.config.updateConfig(copyUserConfig);
    }
  };

  public fetchUserConfig = () => {
    this.config
      .fetchUserConfig()
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        this.userConfig = value;
        this.selectedMusic = value?.music!;
      });
  };

  ngOnDestroy(): void {
    //console.log('destroyed');
  }
}
