import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildComponent } from '../child.component';

describe('BlogComponent', (): void => {
  let component: ChildComponent;
  let fixture: ComponentFixture<ChildComponent>;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      imports: [ChildComponent],
    });
  });

  beforeEach((): void => {
    fixture = TestBed.createComponent(ChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should emit a 🐢`, () => {
    jest.spyOn(component.addItemEvent, 'emit');

    component.addItem();

    expect(component.addItemEvent.emit).toHaveBeenCalledWith('🐢');
  });
});
