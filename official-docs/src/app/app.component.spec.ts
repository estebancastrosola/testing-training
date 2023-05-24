import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });


  [
    ['abc', 3],
    ['ab', 2],
    ['', 0],
  ].forEach(([string, expectedLength]) => {
    it(`should return length ${expectedLength} for string "${string}"`, () => {
      expect(string.toString().length).toBe(parseInt(expectedLength.toString()));
    });
  });
});
