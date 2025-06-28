import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from '../main';
import { ChildComponent } from '../child.component';

describe.skip('App', (): void => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      imports: [App, ChildComponent],
    });
  });

  beforeEach((): void => {
    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should push 🐢 to array`, () => {
    component.addItem('🐢');

    expect(component.items).toEqual(['🐢']);
    expect(component.items.length).toEqual(1);
  });
});
