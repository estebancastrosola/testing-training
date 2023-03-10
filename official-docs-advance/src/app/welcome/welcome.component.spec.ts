import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { UserService } from '../model/user.service';
import { WelcomeComponent } from './welcome.component';

class MockUserService {
  isLoggedIn = true;
  user = { name: 'Test User'};
}

describe('WelcomeComponent (class only)', () => {
  let comp: WelcomeComponent;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // provide the component-under-test and dependent service
      providers: [
        WelcomeComponent,
        { provide: UserService, useClass: MockUserService }
      ]
    });
    // inject both the component and the dependent service.
    comp = TestBed.inject(WelcomeComponent);
    userService = TestBed.inject(UserService);
  });

  it('should not have welcome message after construction', () => {
    expect(comp.welcome).toBe('');
  });

  it('should welcome logged in user after Angular calls ngOnInit', () => {
    comp.ngOnInit();
    expect(comp.welcome).toContain(userService.user.name);
  });

  it('should ask user to log in if not logged in after ngOnInit', () => {
    userService.isLoggedIn = false;
    comp.ngOnInit();
    expect(comp.welcome).not.toContain(userService.user.name);
    expect(comp.welcome).toContain('log in');
  });
});

describe('WelcomeComponent', () => {

  let comp: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let componentUserService: UserService; // the actually injected service
  let userService: UserService; // the TestBed injected service
  let el: HTMLElement; // the DOM element with the welcome message

  let userServiceStub: Partial<UserService>;

  beforeEach(() => {
    // stub UserService for test purposes
    userServiceStub = {
      isLoggedIn: true,
      user: { name: 'Test User' },
    };

    TestBed.configureTestingModule({
       declarations: [ WelcomeComponent ],
    // providers: [ UserService ],  // NO! Don't provide the real service!
                                    // Provide a test-double instead
       providers: [ { provide: UserService, useValue: userServiceStub } ],

       //No usamos el UserService real! usamos un mock del servicio. Esto se llama Test-double
        //La filosofia es que no se prueban nunca servicios reales, siempre se usan mocks, fakes porque queremos probar el componente, no el servicio
        //Probar el servicio real, puede ser una pesadilla (dicho por la guia oficial de Angular!! ) Siempre hay que hacer un mock que satisfaga con el menor codigo posible,
        // la prueba que queremos hacer
    });

    fixture = TestBed.createComponent(WelcomeComponent);
    comp    = fixture.componentInstance;

    //hay 2 formas de coger el servicio, la Que siempre funciona es cogerla a traves del componennt. No obstante casi siempre son las mismas, hay un test que se comprueba que son lo mismo
    // UserService actually injected into the component
    userService = fixture.debugElement.injector.get(UserService);
    componentUserService = userService;
    // UserService from the root injector
    userService = TestBed.inject(UserService);

    //  get the "welcome" element by CSS selector (e.g., by class name)
    el = fixture.nativeElement.querySelector('.welcome');
  });

  it('should welcome the user', () => {
    fixture.detectChanges();
    const content = el.textContent;
    expect(content)
      .withContext('"Welcome ..."')
      .toContain('Welcome');
    expect(content)
      .withContext('expected name') //opcional, failure label
      .toContain('Test User');
  });

  it('should welcome "Bubba"', () => {
    userService.user.name = 'Bubba'; // welcome message hasn't been shown yet
    fixture.detectChanges();
    expect(el.textContent).toContain('Bubba');
  });

  it('should request login if not logged in', () => {
    userService.isLoggedIn = false; // welcome message hasn't been shown yet
    fixture.detectChanges();
    const content = el.textContent;
    expect(content)
      .withContext('not welcomed')
      .not.toContain('Welcome');
    expect(content)
      .withContext('"log in"')
      .toMatch(/log in/i);
  });

  it("should inject the component's UserService instance",
    inject([UserService], (service: UserService) => {
    expect(service).toBe(componentUserService);
  }));

  it('TestBed and Component UserService should be the same', () => {
    expect(userService).toBe(componentUserService);
  });
});
