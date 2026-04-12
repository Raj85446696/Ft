import { Component, inject, PLATFORM_ID, ChangeDetectorRef, OnDestroy, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IdentityService } from '../../services/identity.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { environment } from '../../../environments/environment';

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
  private http = inject(HttpClient);

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
  imgLogo = "/assets/umang-logo.png";
  imgImageDigitalGovernance = "/assets/adbc9337efe8b479d64a442a73cc00f36b104c5e.png";
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
        console.log('Login response received:', response);
        
        if (response.rs === 'S' && response.pd) {
          // Login successful
          console.log('Login successful:', response.pd.mailId);
          
          // Handle remember me
          if (this.rememberMe) {
            this.saveCredentials();
          } else {
            this.clearSavedCredentials();
          }

          // Check for first login or password expiry
          if (response.pd.firstLogin === 'Y') {
            // First login — prompt password change via forgot-password modal
            this.errorMessage = 'First login detected. Please change your password.';
            this.cdr.detectChanges();
            this.fpUserId = this.userId;
            this.navigateToForgotPassword();
          } else if (response.pd.pwdExpiry) {
            const expiryDate = new Date(response.pd.pwdExpiry);
            const today = new Date();
            if (expiryDate < today) {
              // Password expired — prompt change via forgot-password modal
              this.errorMessage = 'Your password has expired. Please reset it.';
              this.cdr.detectChanges();
              this.fpUserId = this.userId;
              this.navigateToForgotPassword();
              return;
            }
          }

          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        } else {
          // Login failed
          console.log('Login failed - calling handleLoginError with rc:', response.rc, 'rd:', response.rd);
          this.handleLoginError(response.rc, response.rd);
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        this.errorMessage = error.message || 'Login failed. Please try again.';
        console.log('Error callback - errorMessage set to:', this.errorMessage);
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Handle login errors with user-friendly messages
   */
  private handleLoginError(code: string, message: string) {
    console.log('handleLoginError called with code:', code, 'message:', message);
    // Use the exact message from backend's rd field
    this.errorMessage = message || 'Login failed. Please try again.';
    console.log('errorMessage set to:', this.errorMessage);
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

    const requestBody = {
      userId: this.fpUserId,
      mno: '',
      lang: 'en',
      trkr: 'h' + Date.now()
    };

    this.http.post<any>(`${environment.identityApiUrl}/ws1/slfinitotp`, requestBody)
      .subscribe({
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
        },
        error: (error) => {
          this.fpIsLoading = false;
          this.fpErrorMessage = error.error?.rd || error.error?.message || 'Failed to send OTP. Please try again.';
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

    const requestBody = {
      userId: this.fpUserId,
      newpwd: this.fpNewPassword,
      otp: this.fpOtp,
      lang: 'en',
      trkr: 'k' + Date.now()
    };

    this.http.post<any>(`${environment.identityApiUrl}/ws1/slffp`, requestBody)
      .subscribe({
        next: (response) => {
          this.fpIsLoading = false;
          
          if (response.rs === 'S') {
            this.fpSuccessMessage = 'Password has been successfully changed!';
            this.fpErrorMessage = '';
            
            // Close modal after 2 seconds
            setTimeout(() => {
              this.closeForgotPasswordModal();
            }, 2000);
          } else {
            this.fpErrorMessage = response.rd || 'Failed to change password';
          }
        },
        error: (error) => {
          this.fpIsLoading = false;
          
          if (error.error?.rc === 'SAO') {
            // Same as old password — user can try a different password with same OTP
            this.fpErrorMessage = error.error?.rd || 'New password cannot be the same as your last 3 passwords.';
            this.fpNewPassword = '';
            this.fpConfirmPassword = '';
          } else if (error.error?.rc === 'SLF2002' || error.error?.rc === 'IOT') {
            // OTP invalid or expired — reset OTP flow
            this.fpErrorMessage = error.error?.rd || 'OTP has expired. Please request a new one.';
            this.fpOtp = '';
            this.fpNewPassword = '';
            this.fpConfirmPassword = '';
            this.fpCanRequestOTP.set(true);
            this.fpOtpRequested.set(false);
          } else {
            this.fpErrorMessage = error.error?.rd || error.error?.message || 'Failed to change password. Please try again.';
          }
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
