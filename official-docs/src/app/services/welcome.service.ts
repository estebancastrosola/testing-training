import { Injectable } from '@angular/core';

@Injectable()
export class WelcomeService {

  isLoggedIn = true;
  user = { name: 'Nombre Del Servicio'};
  
}
