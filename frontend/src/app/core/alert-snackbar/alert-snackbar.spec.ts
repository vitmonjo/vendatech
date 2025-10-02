import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertSnackbar } from './alert-snackbar';

describe('AlertSnackbar', () => {
  let component: AlertSnackbar;
  let fixture: ComponentFixture<AlertSnackbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertSnackbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertSnackbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
