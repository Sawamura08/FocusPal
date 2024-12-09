import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { PomoTaskConfigService } from '../../service/pomo-task-config.service';
import { Conversion, PomodoroConfiguration } from '../../class/config';
import {
  configText,
  updateConfigField,
  userPomoConfig,
} from '../../../../../interfaces/pomoPal';
import { modalStatus } from '../../../../../Objects/modal.details';
import { slideUp } from '../../../../../animation/slide-up.animate';
import { FormBuilder } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PomoSettingsObservableService } from '../../service/pomo-settings-observable.service';

@Component({
  selector: 'app-pomo-settings',
  templateUrl: './pomo-settings.component.html',
  styleUrl: './pomo-settings.component.scss',
  animations: [slideUp],
})
export class PomoSettingsComponent implements OnInit {
  constructor(
    protected configService: PomoTaskConfigService,
    protected pomoSettings: PomoSettingsObservableService
  ) {
    this.configClass = new PomodoroConfiguration(configService);
    this.conversion = new Conversion();
  }

  ngOnInit(): void {
    /* CHECK IF THERE IS EXISTING CONFIG BY ID */
    this.checkExistingUser();
  }

  /* GLOBAL DECLARATION */
  public destroyRef = inject(DestroyRef);
  public navBtnIndex: number = 0;
  public navBtn: string[] = ['Time', 'Music'];
  @Input() userId: number | undefined;
  public configClass: PomodoroConfiguration;
  public userConfig: userPomoConfig | undefined;
  public focusSession: number = 1500; // DEFAULT VALUES
  public shortBreak: number = 300;
  public longBreak: number = 900;
  public longBreakAfter: number = 4;
  public conversion: Conversion;

  public setNavBtnIndex = (index: number) => {
    this.navBtnIndex = index;
  };

  /* IF THERE IS NO EXISTING USER INSERT NEW DATA BY USER ID */
  public checkExistingUser = async () => {
    if (this.userId != undefined) {
      this.configClass
        .fetchUserConfig()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((result) => {
          if (result) {
            this.userConfig = structuredClone(result);
            this.focusSession = this.userConfig?.pomodoro!;
            this.shortBreak = this.userConfig?.shortBreak!;
            this.longBreak = this.userConfig?.longBreak!;
            this.longBreakAfter = this.userConfig?.longBreakAfter!;
          } else {
            this.insertNewUserConfig();
          }
        });
    }
  };

  public insertNewUserConfig = async () => {
    if (this.userId != undefined) {
      await this.configClass.insertNewConfig(this.userId);
    }
  };

  public animateSettings: boolean = true;
  public closeSettings = () => {
    this.animateSettings = false;

    setTimeout(() => {
      this.pomoSettings.setSettingsModalStatus(modalStatus.close);
    }, 300);
  };

  /* ------------ CONFIGURATION VALUE MODAL ---------------- */
  public valueConfigurationModal: boolean = modalStatus.close;
  public animateConfigModal: boolean = true;
  public configText = configText;
  public currentConfigText: string = '';
  public updateField: keyof userPomoConfig | undefined;
  public configValue: number | undefined;

  public openConfigModal = (configKeyName: number) => {
    if (this.userConfig != undefined) {
      // SET WHICH TEXT TO DISPLAY ON THE SET VALUE CONFIGURATION (THE SMALL MODAL)
      this.currentConfigText = this.configText[configKeyName];

      // SET WHAT FIELD TO UPDATE SINCE IT ONLY USE ONE TEXT FIELD
      this.updateField = updateConfigField[
        configKeyName
      ] as keyof userPomoConfig;

      /* CONVERT THE VALUE TO MIN BEFORE DISPLAYING THE MODAL */
      if (this.updateField != 'longBreakAfter') {
        this.configValue = this.conversion.convertSecToMin(
          this.userConfig[this.updateField]!
        );
      } else {
        this.configValue = this.userConfig[this.updateField];
      }
    }
    this.valueConfigurationModal = modalStatus.open;
  };

  public closeConfigModal = () => {
    this.resetConfigModal();
    this.animateConfigModal = false;

    setTimeout(() => {
      this.valueConfigurationModal = modalStatus.close;
      this.animateConfigModal = true; // bring back the default value to animate
    }, 300);
  };

  public resetConfigModal = () => {
    this.currentConfigText = '';
    this.updateField = undefined;
    this.configValue = undefined;
  };

  /* add value  */
  public IncrementConfigValue = () => {
    if (this.userConfig && this.updateField != undefined) {
      if (this.configValue != undefined && this.configValue >= 1) {
        this.configValue++;

        this.updateConfigValue();
      }
    }
  };

  /* decrement value */
  public decrementConfigValue = () => {
    if (this.userConfig && this.updateField != undefined) {
      if (this.configValue != undefined && this.configValue >= 2) {
        this.configValue--;

        this.updateConfigValue();
      }
    }
  };

  public updateConfigValue = () => {
    if (this.updateField != 'longBreakAfter') {
      this.userConfig![this.updateField!] = this.conversion.convertMinToSeconds(
        this.configValue!
      );
    } else {
      this.userConfig![this.updateField] = this.configValue;
    }

    this.configClass.updateConfig(this.userConfig!);
  };

  /* -------------------- END ------------------- */
}
