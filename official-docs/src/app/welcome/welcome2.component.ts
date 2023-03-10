import { Component, OnInit } from '@angular/core';
import { WelcomeService } from '../services/welcome.service';

@Component({
  selector: 'app-welcome2',
  templateUrl: './welcome2.component.html',
  styleUrls: ['./welcome2.component.scss']
})
export class Welcome2Component implements OnInit {

  welcome: string = '';

  constructor(private welcomeService: WelcomeService){

  }

  ngOnInit(): void {
    this.welcome = this.welcomeService.isLoggedIn ?
      'Welcome, ' + this.welcomeService.user.name : 'Please log in.';
  }
}
