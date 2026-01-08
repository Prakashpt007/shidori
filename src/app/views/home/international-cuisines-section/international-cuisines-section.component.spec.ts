import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalCuisinesSectionComponent } from './international-cuisines-section.component';

describe('InternationalCuisinesSectionComponent', () => {
  let component: InternationalCuisinesSectionComponent;
  let fixture: ComponentFixture<InternationalCuisinesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternationalCuisinesSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InternationalCuisinesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
