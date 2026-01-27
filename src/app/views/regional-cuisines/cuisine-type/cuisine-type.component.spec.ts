import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuisineTypeComponent } from './cuisine-type.component';

describe('CuisineTypeComponent', () => {
  let component: CuisineTypeComponent;
  let fixture: ComponentFixture<CuisineTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuisineTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CuisineTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
