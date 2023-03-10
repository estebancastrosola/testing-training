import { fakeAsync, ComponentFixture, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { asyncData, asyncError } from '../../testing';

import { of, throwError } from 'rxjs';
import { last } from 'rxjs/operators';

import { TwainComponent } from './twain.component';
import { TwainService } from './twain.service';

describe('TwainComponent', () => {
  let component: TwainComponent;
  let fixture: ComponentFixture<TwainComponent>;
  let getQuoteSpy: jasmine.Spy;
  let quoteEl: HTMLElement;
  let testQuote: string;

  // Helper function to get the error message element value
  // An *ngIf keeps it out of the DOM until there is an error
  const errorMessage = () => {
    const el = fixture.nativeElement.querySelector('.error');
    return el ? el.textContent : null;
  };

  beforeEach(() => {
    testQuote = 'Test Quote';

    // Create a fake TwainService object with a `getQuote()` spy
    const twainService = jasmine.createSpyObj('TwainService', ['getQuote']); //Con esto creamos con jasmine un servicio fake
    // Make the spy return a synchronous Observable with the test data
    getQuoteSpy = twainService.getQuote.and.returnValue(of(testQuote)); //Entonces creamos una respuesta para el servicio y la funcion -> Esto es sincrono. Se devuelve el dato inmediatamente. Esto es una especie de Observable Sincrono
    //La gran ventaja de esto es que pasamos de procesos asincornos a tests sincronos

    TestBed.configureTestingModule({
      declarations: [TwainComponent],
      providers: [{provide: TwainService, useValue: twainService}] //Fakeamos el servicio en el provider
    });

    fixture = TestBed.createComponent(TwainComponent);
    component = fixture.componentInstance;
    quoteEl = fixture.nativeElement.querySelector('.twain');
  });

  describe('when test with synchronous observable', () => {//Como ya sabemos, si no llamamos al detect changes no se bindean los datos si se llama al oninit ni nada
    it('should not show quote before OnInit', () => {
      expect(quoteEl.textContent)
        .withContext('nothing displayed')
        .toBe('');
      expect(errorMessage())
        .withContext('should not show error element')
        .toBeNull();
      expect(getQuoteSpy.calls.any()) //No se ha llamado tampoco al oninit sin el detectChanges
        .withContext('getQuote not yet called')
        .toBe(false);
    });

    // The quote would not be immediately available if the service were truly async.
    it('should show quote after component initialized', () => {
      fixture.detectChanges();  // onInit()

      // sync spy result shows testQuote immediately after init
      expect(quoteEl.textContent).toBe(testQuote); //Esto funciona porque el servicio fake devuelve inmediatamente el valor
      expect(getQuoteSpy.calls.any())
        .withContext('getQuote called')
        .toBe(true);
    });


    // The error would not be immediately available if the service were truly async.
    // Use `fakeAsync` because the component error calls `setTimeout`
    it('should display error when TwainService fails', fakeAsync(() => {
         // tell spy to return an error observable
         getQuoteSpy.and.returnValue(throwError(() => new Error('TwainService test failure')));
         fixture.detectChanges();  // onInit()
         // sync spy errors immediately after init

         tick();  // flush the component's setTimeout()

         fixture.detectChanges();  // update errorMessage within setTimeout()

         expect(errorMessage())
          .withContext('should display error')
          .toMatch(/test failure/, );
         expect(quoteEl.textContent)
          .withContext('should show placeholder')
          .toBe('...');
       }));
  });

  describe('when test with asynchronous observable', () => { //Ahora vamos a hacer un test, para simular de forma mas real una llamada asimcrona
    beforeEach(() => {
      // Simulate delayed observable values with the `asyncData()` helper
      getQuoteSpy.and.returnValue(asyncData(testQuote)); //Ahora decimos que vamos a devolver un observable asincrono
    });

    it('should not show quote before OnInit', () => {
      expect(quoteEl.textContent)
        .withContext('nothing displayed')
        .toBe('');
      expect(errorMessage())
        .withContext('should not show error element')
        .toBeNull();
      expect(getQuoteSpy.calls.any())
        .withContext('getQuote not yet called')
        .toBe(false);
    });

    it('should still not show quote after component initialized', () => {
      fixture.detectChanges();
      // getQuote service is async => still has not returned with quote
      // so should show the start value, '...'
      expect(quoteEl.textContent)
        .withContext('should show placeholder')
        .toBe('...');
      expect(errorMessage())
        .withContext('should not show error')
        .toBeNull();
      expect(getQuoteSpy.calls.any())
        .withContext('getQuote called')
        .toBe(true);
    });

    it('should show quote after getQuote (fakeAsync)', fakeAsync(() => { //De nuevo, con el nuevo tipo de asincrono servicio, usamos tick para ver que funciona
         fixture.detectChanges();  // ngOnInit()
         expect(quoteEl.textContent)
          .withContext('should show placeholder')
          .toBe('...');

         tick();                   // flush the observable to get the quote
         fixture.detectChanges();  // update view

         expect(quoteEl.textContent)
          .withContext('should show quote')
          .toBe(testQuote);
         expect(errorMessage())
          .withContext('should not show error')
          .toBeNull();
       }));

    it('should show quote after getQuote (waitForAsync)', waitForAsync(() => { //Otra cosa que podemos hacer es, en vez de tener que usar tick, usar waitforasync, de modo que nos esperamos a que el async acabe. Esto es muy util, ya que nos facilita la vida para los tests asincronos
         fixture.detectChanges();  // ngOnInit()
         expect(quoteEl.textContent)
          .withContext('should show placeholder')
          .toBe('...');

         fixture.whenStable().then(() => {  // wait for async getQuote. con whenStable, nos esperamos al primer valor
           fixture.detectChanges();         // update view with quote
           expect(quoteEl.textContent).toBe(testQuote);
           expect(errorMessage())
            .withContext('should not show error')
            .toBeNull();
         });
       }));


    it('should show last quote (quote done)', (done: DoneFn) => {// Otras formas de usar observables asincronos, pero mas tradiional y usando done, que es mas compilao
      fixture.detectChanges();

      component.quote.pipe(last()).subscribe(() => {
        fixture.detectChanges();  // update view with quote
        expect(quoteEl.textContent).toBe(testQuote);
        expect(errorMessage())
          .withContext('should not show error')
          .toBeNull();
        done();
      });
    });

    it('should show quote after getQuote (spy done)', (done: DoneFn) => {
      fixture.detectChanges();

      // the spy's most recent call returns the observable with the test quote
      getQuoteSpy.calls.mostRecent().returnValue.subscribe(() => {
        fixture.detectChanges();  // update view with quote
        expect(quoteEl.textContent).toBe(testQuote);
        expect(errorMessage())
          .withContext('should not show error')
          .toBeNull();
        done();
      });
    });

    it('should display error when TwainService fails', fakeAsync(() => { //fakeAsync sirve para testear cosas asyncronas como settimeout!. FakeAsync es imprescindible para decirle a jasmine que esto es una zona para test asincronos
        //the fakeAsync() function enables a linear coding style by running the test body in a special fakeAsync test zone. The test body appears to be synchronous. There is no nested syntax (like a Promise.then()) to disrupt the flow of control. 
        //Los fakeAsync tienen una limitacion!: 
        //Limitation: The fakeAsync() function won't work if the test body makes an XMLHttpRequest (XHR) call. XHR calls within a test are rare, but if you need to call XHR, see the waitForAsync() section.


      // tell spy to return an async error observable
         getQuoteSpy.and.returnValue(asyncError<string>('TwainService test failure')); //Ahora le decimos al servicio fake, que va a devolver observable de error
         //Para testear que el error se muestra por pantalla y que los datos en pantalla son los que nosotros queremos

         fixture.detectChanges();
         tick();                   // component shows error after a setTimeout()/ con tick finalizamos inmediatamente todas las llamadas asynchronous
        //tick mas explicado: Lo que hace tick es simular el paso del tiempo.


         //Esto lo tenemos que hacer asi, porque los timeouts por ejemplo los test no sabe manejarlos, y tenemos que recurrir a estas cosas
         fixture.detectChanges();  // update error message

         expect(errorMessage())
          .withContext('should display error')
          .toMatch(/test failure/);
         expect(quoteEl.textContent)
          .withContext('should show placeholder')
          .toBe('...');
       }));
  });
});
