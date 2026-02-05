import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudKitchensComponent } from './cloud-kitchens.component';

describe('CloudKitchensComponent', () => {
  let component: CloudKitchensComponent;
  let fixture: ComponentFixture<CloudKitchensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloudKitchensComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CloudKitchensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
