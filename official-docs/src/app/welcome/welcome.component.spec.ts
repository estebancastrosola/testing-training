import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeService } from '../services/welcome.service';

import { WelcomeComponent } from './welcome.component';

class MockWelcomeService {
  isLoggedIn = true;
  user = { name: 'Nombre Fake'};
}

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let welcomeService: WelcomeService;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => { //El beforeEach 
    await TestBed.configureTestingModule({
      //declarations: [  WelcomeComponent], Si creamos el componente con TestBed, necesitamos meterlo en los providers
      declarations: [  ],
      providers: [ WelcomeComponent, { provide: WelcomeService, useClass: MockWelcomeService } ] //Con el UseClass podemos usar otra clase ne vez de la original
    })
    .compileComponents(); //TODO: Para que sirve el compile components? Solo se que es asyncrono y por eso lo tenemos en un await con un async. Tambien lo podremos ver con un WaitForAsync en el TestBed

    fixture = TestBed.createComponent(WelcomeComponent); //Crea una instancia del componente, crea el correspondiente elemento para el Test RunnerDOM, y devuelve un ComponentFixture, Esto se hace siempre despues de configurar el TestBed. El componentFixture, sirve para poder interactuar con el componente creado (YO CREO al 99 que si lo creas con el TestBed Inject no se podra acceder a determinadas cosas del DOM creo) 
    // component = fixture.componentInstance; si creamos el componente a traves del a fixture, creamos el componente con sus dependencias NO con la configuracion de TestBed, y con los ciclos de vida del componente
    component = TestBed.inject(WelcomeComponent); //Si creamos el componente con la configuracion de TestBed, lo creamos con los providers indicados. Hay que ir ejecutando sus ciclos de vida, como lo haria angular cuando crea el componente. A esto se le llama, class-only test ( NO se puede acceder al DOM ni manupularlo)
    welcomeService = TestBed.inject(WelcomeService);
    fixture.detectChanges();

    //TODO este setup se puede meter en los iT, tanto el configureTesting como la creacion de todos los componentes


    //Cosas importantes que he visto en la doc pero no estan como ejemplo
    /** 
     * Se puede acceder al HTML Element const bannerElement: HTMLElement = fixture.nativeElement;
     * 
     * Pero hay una mejor manera con mejor compatibildad con mas abstraccion 
     * 
     * const bannerDe: DebugElement = fixture.debugElement;
       const bannerEl: HTMLElement = bannerDe.nativeElement;
     * 

       Para acceder a cosas del DOM, se pueden hacer query selector o By.css() por lo visto con el By.css se tiene mejor compatibilidad o algunas cosa asi
     */
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should not have welcome message after construction', () => {
    expect(component.welcome).toBe('');
  });
  
  it('should welcome logged in user after Angular calls ngOnInit', () => {
    component.ngOnInit(); //Hay que ejecutar el on init manualmente
    expect(component.welcome).toContain(welcomeService.user.name);
  });
  
});
