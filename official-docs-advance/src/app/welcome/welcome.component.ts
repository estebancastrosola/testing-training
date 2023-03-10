import { Component, OnInit } from '@angular/core';
import { UserService } from '../model/user.service';

@Component({
  selector: 'app-welcome',
  template: '<h3 class="welcome"><i>{{welcome}}</i></h3>'
})
export class WelcomeComponent implements OnInit {
  welcome = '';
  constructor(private userService: UserService) { } //Dependecia de un servicio!

  ngOnInit(): void {
    this.welcome = this.userService.isLoggedIn ?
      'Welcome, ' + this.userService.user.name : 'Please log in.';
  }
}
