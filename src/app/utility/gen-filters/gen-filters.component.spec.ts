import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenFiltersComponent } from './gen-filters.component';

describe('GenFiltersComponent', () => {
  let component: GenFiltersComponent;
  let fixture: ComponentFixture<GenFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenFiltersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
