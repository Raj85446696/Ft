import { Component, inject, PLATFORM_ID, ChangeDetectorRef, OnDestroy, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IdentityService } from '../../services/identity.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnDestroy {
  private identityService = inject(IdentityService);
  private errorHandler = inject(ErrorHandlerService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  // Login Form fields
  userId: string = '';
  password: string = '';
  rememberMe: boolean = false;
  
  // Login UI state
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  // Forgot Password Modal State
  showForgotPasswordModal: boolean = false;
  fpUserId: string = '';
  fpOtp: string = '';
  fpNewPassword: string = '';
  fpConfirmPassword: string = '';
  fpOtpRequested = signal(false);
  fpCanRequestOTP = signal(true);
  fpShowNewPassword: boolean = false;
  fpShowConfirmPassword: boolean = false;
  fpIsLoading: boolean = false;
  fpErrorMessage: string = '';
  fpSuccessMessage: string = '';
  fpTimeLeft = signal(0);
  private fpOtpTimerInterval: any = null;
  fpMinPasswordLen = 8;
  fpMaxPasswordLen = 50;

  // Image assets
  imgLogo = "/assets/selfcare_toplogo.png";
  imgImageDigitalGovernance = "/assets/process-flow.png";
  imgIcon = "/assets/5207febf337317eb0f51ce7415f6aa0e143b96ff.svg";
  imgIcon1 = "/assets/1c099cf69f3ff7ac2d367b2d6ac4bc7477441cf8.svg";
  imgIcon2 = "/assets/1c099cf69f3ff7ac2d367b2d6ac4bc7477441cf8.svg"; // lock icon
  imgVector = "/assets/f52ff4725d427ef2603ed1029d71a00377fdd6d7.svg";
  imgVector1 = "/assets/13419ee2a303845ed3054042f9cf9cac17f473c8.svg";

  ngOnInit() {
    // Check if already authenticated (only in browser)
    if (this.isBrowser() && this.identityService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    // Load saved credentials if remember me was checked
    if (this.isBrowser()) {
      this.loadRememberedCredentials();
    }
  }

  /**
   * Check if running in browser
   */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Handle login form submission
   */
  onLogin(event: Event) {
    event.preventDefault();
    
    // Reset error message
    this.errorMessage = '';

    // Validate inputs
    if (!this.userId || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      this.cdr.detectChanges();
      return;
    }

    // Email validation
    if (!this.isValidEmail(this.userId)) {
      this.errorMessage = 'Please enter a valid email address';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;

    // Call Identity Service login
    this.identityService.login(this.userId, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.rs === 'S' && response.pd) {
          // Handle remember me
          if (this.rememberMe) {
            this.saveCredentials();
          } else {
            this.clearSavedCredentials();
          }

          // Check for first login or password expiry
          if (response.pd.firstLogin === 'Y') {
            this.errorMessage = 'First login detected. Please change your password.';
            this.cdr.detectChanges();
            this.fpUserId = this.userId;
            this.navigateToForgotPassword();
          } else if (response.pd.pwdExpiry) {
            const expiryDate = new Date(response.pd.pwdExpiry);
            const today = new Date();
            if (expiryDate < today) {
              this.errorMessage = 'Your password has expired. Please reset it.';
              this.cdr.detectChanges();
              this.fpUserId = this.userId;
              this.navigateToForgotPassword();
              return;
            }
          }

          this.router.navigate(['/dashboard']);
        } else {
          this.handleLoginError(response.rc, response.rd);
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Login failed. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Handle login errors with user-friendly messages
   */
  private handleLoginError(code: string, message: string) {
    this.errorMessage = message || 'Login failed. Please try again.';
    this.cdr.detectChanges();

    // Handle specific actions based on error code
    if (code === 'PPE') {
      // Password expired — open forgot-password modal after showing error
      setTimeout(() => {
        this.fpUserId = this.userId;
        this.navigateToForgotPassword();
      }, 2000);
    }
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Save credentials to localStorage
   */
  private saveCredentials() {
    if (this.isBrowser()) {
      localStorage.setItem('rememberedEmail', this.userId);
    }
  }

  /**
   * Load remembered credentials
   */
  private loadRememberedCredentials() {
    if (this.isBrowser()) {
      const rememberedEmail = localStorage.getItem('rememberedEmail');
      if (rememberedEmail) {
        this.userId = rememberedEmail;
        this.rememberMe = true;
      }
    }
  }

  /**
   * Clear saved credentials
   */
  private clearSavedCredentials() {
    if (this.isBrowser()) {
      localStorage.removeItem('rememberedEmail');
    }
  }

  /**
   * Open Forgot Password Modal
   */
  navigateToForgotPassword() {
    this.showForgotPasswordModal = true;
    this.resetForgotPasswordForm();
  }

  /**
   * Close Forgot Password Modal
   */
  closeForgotPasswordModal() {
    this.showForgotPasswordModal = false;
    this.resetForgotPasswordForm();
    if (this.fpOtpTimerInterval) {
      clearInterval(this.fpOtpTimerInterval);
      this.fpOtpTimerInterval = null;
    }
  }

  /**
   * Reset Forgot Password Form
   */
  private resetForgotPasswordForm() {
    this.fpUserId = '';
    this.fpOtp = '';
    this.fpNewPassword = '';
    this.fpConfirmPassword = '';
    this.fpOtpRequested.set(false);
    this.fpCanRequestOTP.set(true);
    this.fpShowNewPassword = false;
    this.fpShowConfirmPassword = false;
    this.fpIsLoading = false;
    this.fpErrorMessage = '';
    this.fpSuccessMessage = '';
    this.fpTimeLeft.set(0);
  }

  /**
   * Request OTP for Forgot Password
   */
  requestOTP() {
    if (!this.fpUserId || this.fpUserId.trim() === '') {
      this.fpErrorMessage = 'User ID is required';
      return;
    }

    this.fpErrorMessage = '';
    this.fpIsLoading = true;

    this.identityService.initOtp(this.fpUserId).subscribe({
      next: (response) => {
        this.fpIsLoading = false;
        if (response.rs === 'S') {
          this.fpSuccessMessage = `OTP successfully sent to ${this.fpUserId}`;
          this.fpOtpRequested.set(true);
          this.fpCanRequestOTP.set(false);
          this.startFPOTPTimer();
        } else {
          this.fpErrorMessage = response.rd || 'Failed to send OTP';
        }
            this.cdr.detectChanges();
      },
      error: (error) => {
        this.fpIsLoading = false;
        this.fpErrorMessage = error.message || 'Failed to send OTP. Please try again.';
          this.cdr.detectChanges();
      }
    });
  }

  /**
   * Start OTP Timer for Forgot Password
   */
  startFPOTPTimer() {
    if (this.fpOtpTimerInterval) {
      clearInterval(this.fpOtpTimerInterval);
    }

    this.fpTimeLeft.set(60);

    this.fpOtpTimerInterval = window.setInterval(() => {
      const currentValue = this.fpTimeLeft();
      this.fpTimeLeft.set(currentValue - 1);
      
      if (this.fpTimeLeft() <= 0) {
        clearInterval(this.fpOtpTimerInterval);
        this.fpOtpTimerInterval = null;
        this.fpCanRequestOTP.set(true);
      }
    }, 1000);
  }

  /**
   * Change Password via Forgot Password
   */
  changeForgotPassword() {
    // Validation
    if (!this.fpUserId || this.fpUserId.trim() === '') {
      this.fpErrorMessage = 'User ID is required';
      return;
    }

    if (!this.fpOtp || this.fpOtp.trim() === '') {
      this.fpErrorMessage = 'OTP is required';
      return;
    }

    if (!this.fpNewPassword || this.fpNewPassword.length < this.fpMinPasswordLen) {
      this.fpErrorMessage = `Password should be at least ${this.fpMinPasswordLen} characters long`;
      return;
    }

    if (this.fpNewPassword !== this.fpConfirmPassword) {
      this.fpErrorMessage = 'Passwords do not match';
      return;
    }

    this.fpErrorMessage = '';
    this.fpSuccessMessage = '';
    this.fpIsLoading = true;

    this.identityService.forgotPassword(this.fpUserId, this.fpNewPassword, this.fpOtp).subscribe({
      next: (response) => {
        this.fpIsLoading = false;
        if (response.rs === 'S') {
          this.fpSuccessMessage = 'Password has been successfully changed!';
          this.fpErrorMessage = '';
          setTimeout(() => {
            this.closeForgotPasswordModal();
          }, 2000);
        } else {
          this.fpErrorMessage = response.rd || 'Failed to change password';
        }
            this.cdr.detectChanges();
      },
      error: (error) => {
        this.fpIsLoading = false;
        this.fpErrorMessage = error.message || 'Failed to change password. Please try again.';
          this.cdr.detectChanges();
      }
    });
  }

  /**
   * Toggle password visibility in forgot password modal
   */
  toggleFPNewPasswordVisibility() {
    this.fpShowNewPassword = !this.fpShowNewPassword;
  }

  toggleFPConfirmPasswordVisibility() {
    this.fpShowConfirmPassword = !this.fpShowConfirmPassword;
  }

  /**
   * Cleanup on component destroy
   */
  ngOnDestroy() {
    if (this.fpOtpTimerInterval) {
      clearInterval(this.fpOtpTimerInterval);
    }
  }
}
