import { Component, OnInit } from '@angular/core';
import { headerType } from '../../../components/header/header.component';
import { greetings } from '../../../JSON/greetings';
import { fetchResponse } from '../../../interfaces/fetch-response';
import { FetchHomeDataService } from '../../../service/fetch-home-data.service';
@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrl: './apps.component.scss',
})
export class AppsComponent implements OnInit {
  constructor(private fetchHomeData: FetchHomeDataService) {}
  ngOnInit(): void {
    this.getGreeting();
  }
  /* SEND HEADER DATA */

  public headerData: headerType = {
    type: 'Home',
    isHome: true,
  };

  /* END OF SEND HEADER DATA */

  /* set Greetings */
  public greetingsArr: string[] = greetings;
  public greeting: string | null = null;
  public getGreeting = (): void => {
    const index = Math.floor(Math.random() * greetings.length);
    this.greeting = this.greetingsArr[index];

    this.getUser();
  };
  /* end */

  public username: string | null = null;
  public getUser = async () => {
    const response: fetchResponse = await this.fetchHomeData.getUsername();

    if (response.status) {
      this.username = response.value?.userName;
    } else {
      console.log(response?.error);
    }
  };
}
