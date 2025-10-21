import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributeFormComponent } from './attribute-form';


describe('AttributeForm', () => {
  let component: AttributeFormComponent;
  let fixture: ComponentFixture<AttributeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
