import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryDetailComponent } from './category-detail';


describe('CategoryDetail', () => {
  let component: CategoryDetailComponent;
  let fixture: ComponentFixture<CategoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
