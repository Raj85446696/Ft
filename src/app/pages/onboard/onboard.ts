import { Component, OnDestroy, signal, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IdentityService } from '../../services/identity.service';

@Component({
  selector: 'app-onboard',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './onboard.html',
  styleUrl: './onboard.css',
})
export class Onboard implements OnDestroy {
    private cdr = inject(ChangeDetectorRef);
  private identityService = inject(IdentityService);
  private router = inject(Router);

  imgImageDigitalGovernance = "/assets/process-flow.png";
  imgLogo = "/assets/selfcare_toplogo.png";
  imgIcon = "/assets/dabda5aced7ad8f7b26d30e4a091629f523d069b.svg";
  imgIcon1 = "/assets/5207febf337317eb0f51ce7415f6aa0e143b96ff.svg";
  imgIcon2 = "/assets/6987bf213cf22c96314610e9a50c5cbe43257511.svg";
  imgIcon3 = "/assets/e227fb18f9c1c4f1aa5e3cd3c9a2f8adff2f8c56.svg";
  imgIcon4 = "/assets/1c099cf69f3ff7ac2d367b2d6ac4bc7477441cf8.svg";
  imgVector = "/assets/f52ff4725d427ef2603ed1029d71a00377fdd6d7.svg";
  imgVector1 = "/assets/13419ee2a303845ed3054042f9cf9cac17f473c8.svg";
  imgIcon5 = "/assets/23836e185714117776b8377b67be166bb9ae76bc.svg";

  // Form fields
  orgType: string = '';
  orgName: string = '';
  requestorName: string = '';
  isSubmitting = false;
  submitError = '';
  submitSuccess = '';

  // Email OTP state
  email: string = '';
  emailOtpRequested = signal(false);
  emailOtp: string = '';
  emailTimer = signal(0);
  emailOtpLoading = false;
  emailOtpError = '';
  emailOtpSuccess = '';
  private emailTimerInterval: any = null;

  // Mobile OTP state
  mobile: string = '';
  mobileOtpRequested = signal(false);
  mobileOtp: string = '';
  mobileTimer = signal(0);
  mobileOtpLoading = false;
  mobileOtpError = '';
  mobileOtpSuccess = '';
  private mobileTimerInterval: any = null;

  ngOnDestroy() {
    if (this.emailTimerInterval) {
      clearInterval(this.emailTimerInterval);
    }
    if (this.mobileTimerInterval) {
      clearInterval(this.mobileTimerInterval);
    }
  }

  onSubmit() {
    this.submitError = '';
    this.submitSuccess = '';

    if (!this.orgType) {
      this.submitError = 'Please select an organization type';
      return;
    }
    if (!this.orgName.trim()) {
      this.submitError = 'Organization name is required';
      return;
    }
    if (!this.requestorName.trim()) {
      this.submitError = 'Requestor name is required';
      return;
    }
    if (!this.email || !this.isValidEmail(this.email)) {
      this.submitError = 'A valid email is required';
      return;
    }
    if (!this.emailOtp.trim()) {
      this.submitError = 'Please enter the email OTP';
      return;
    }

    this.isSubmitting = true;

    this.identityService.registerOrg({
      name: this.requestorName.trim(),
      email: this.email.trim(),
      mno: this.mobile.trim(),
      organization: this.orgName.trim(),
      stateCentral: this.orgType,
      emailOtp: this.emailOtp.trim(),
      mobileOtp: this.mobileOtp.trim()
    }).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.rs === 'S') {
          this.submitSuccess = 'Registration submitted successfully! Your request is under review.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.submitError = response.rd || 'Registration failed. Please try again.';
        }
            this.cdr.detectChanges();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = error.message || 'Registration failed. Please try again.';
          this.cdr.detectChanges();
      }
    });
  }

  onCancel() {
    this.router.navigate(['/login']);
  }

  // Email OTP Methods
  requestEmailOtp() {
    if (!this.email || !this.isValidEmail(this.email)) {
      this.emailOtpError = 'Please enter a valid email address';
      return;
    }

    this.emailOtpError = '';
    this.emailOtpSuccess = '';
    this.emailOtpLoading = true;

    this.identityService.initOtp(this.email).subscribe({
      next: (response) => {
        this.emailOtpLoading = false;
        if (response.rs === 'S') {
          this.emailOtpSuccess = `OTP sent to ${this.email}`;
          this.emailOtpRequested.set(true);
          this.emailTimer.set(60);
          this.startEmailTimer();
        } else {
          this.emailOtpError = response.rd || 'Failed to send OTP';
        }
            this.cdr.detectChanges();
      },
      error: (error) => {
        this.emailOtpLoading = false;
        this.emailOtpError = error.message || 'Failed to send OTP. Please try again.';
          this.cdr.detectChanges();
      }
    });
  }

  startEmailTimer() {
    if (this.emailTimerInterval) {
      clearInterval(this.emailTimerInterval);
    }
    this.emailTimerInterval = window.setInterval(() => {
      this.emailTimer.set(this.emailTimer() - 1);
      if (this.emailTimer() <= 0) {
        clearInterval(this.emailTimerInterval);
        this.emailTimerInterval = null;
      }
    }, 1000);
  }

  resendEmailOtp() {
    if (this.emailTimer() > 0) {
      return;
    }

    this.emailOtpError = '';
    this.emailOtpSuccess = '';
    this.emailOtpLoading = true;

    this.identityService.initOtp(this.email).subscribe({
      next: (response) => {
        this.emailOtpLoading = false;
        if (response.rs === 'S') {
          this.emailOtpSuccess = `OTP resent to ${this.email}`;
          this.emailTimer.set(60);
          this.startEmailTimer();
        } else {
          this.emailOtpError = response.rd || 'Failed to resend OTP';
        }
            this.cdr.detectChanges();
      },
      error: (error) => {
        this.emailOtpLoading = false;
        this.emailOtpError = error.message || 'Failed to resend OTP. Please try again.';
          this.cdr.detectChanges();
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Mobile OTP Methods
  requestMobileOtp() {
    if (!this.mobile || this.mobile.length < 10) {
      this.mobileOtpError = 'Please enter a valid mobile number';
      return;
    }

    this.mobileOtpError = '';
    this.mobileOtpSuccess = '';
    this.mobileOtpLoading = true;

    this.identityService.initOtp('', this.mobile).subscribe({
      next: (response) => {
        this.mobileOtpLoading = false;
        if (response.rs === 'S') {
          this.mobileOtpSuccess = `OTP sent to ${this.mobile}`;
          this.mobileOtpRequested.set(true);
          this.mobileTimer.set(60);
          this.startMobileTimer();
        } else {
          this.mobileOtpError = response.rd || 'Failed to send OTP';
        }
            this.cdr.detectChanges();
      },
      error: (error) => {
        this.mobileOtpLoading = false;
        this.mobileOtpError = error.message || 'Failed to send OTP. Please try again.';
          this.cdr.detectChanges();
      }
    });
  }

  startMobileTimer() {
    if (this.mobileTimerInterval) {
      clearInterval(this.mobileTimerInterval);
    }
    this.mobileTimerInterval = window.setInterval(() => {
      this.mobileTimer.set(this.mobileTimer() - 1);
      if (this.mobileTimer() <= 0) {
        clearInterval(this.mobileTimerInterval);
        this.mobileTimerInterval = null;
      }
    }, 1000);
  }

  resendMobileOtp() {
    if (this.mobileTimer() > 0) {
      return;
    }

    this.mobileOtpError = '';
    this.mobileOtpSuccess = '';
    this.mobileOtpLoading = true;

    this.identityService.initOtp('', this.mobile).subscribe({
      next: (response) => {
        this.mobileOtpLoading = false;
        if (response.rs === 'S') {
          this.mobileOtpSuccess = `OTP resent to ${this.mobile}`;
          this.mobileTimer.set(60);
          this.startMobileTimer();
        } else {
          this.mobileOtpError = response.rd || 'Failed to resend OTP';
        }
            this.cdr.detectChanges();
      },
      error: (error) => {
        this.mobileOtpLoading = false;
        this.mobileOtpError = error.message || 'Failed to resend OTP. Please try again.';
          this.cdr.detectChanges();
      }
    });
  }
}
