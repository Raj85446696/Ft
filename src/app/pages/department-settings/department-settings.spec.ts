import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentSettings } from './department-settings';

describe('DepartmentSettings', () => {
  let component: DepartmentSettings;
  let fixture: ComponentFixture<DepartmentSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
