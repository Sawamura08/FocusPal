import { Component, OnInit } from '@angular/core';
import { Task, User, db } from '../../database/db';
import { DatabaseService } from '../../database/database.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent implements OnInit {
  constructor(
    private db: DatabaseService,
    private route: Router,
    private actRoute: ActivatedRoute
  ) {}
  userList: User[] = [];
  ngOnInit(): void {
    this.db.getUserList().subscribe({
      next: (value) => {
        this.userList = value;
        this.checkSession(value[0].userId);
      },
      error: (err) => {
        console.error('Error', err);
      },
    });
  }

  private checkSession = (id: number) => {
    if (id)
      this.route.navigate(['../../apps/apps'], { relativeTo: this.actRoute });
  };
}
