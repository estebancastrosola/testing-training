import { Component, OnInit } from '@angular/core';
import { WelcomeService } from '../services/welcome.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  providers: [WelcomeService]
})
export class WelcomeComponent implements OnInit {

  welcome: string = '';

  constructor(private welcomeService: WelcomeService){

  }

  ngOnInit(): void{
    this.welcome = this.welcomeService.user.name
  }
}
