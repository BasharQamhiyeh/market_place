import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionList } from './option-list';

describe('OptionList', () => {
  let component: OptionList;
  let fixture: ComponentFixture<OptionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
