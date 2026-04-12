import { Injectable } from '@angular/core';

export interface ErrorInfo {
  title: string;
  message: string;
  action: 'WAIT' | 'RESET_PASSWORD' | 'RETRY' | 'REDIRECT_TO_LOGIN' | 'NONE';
}

/**
 * Service to handle and format error messages from Identity Service
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private errorCodeMap: { [key: string]: ErrorInfo } = {
    'BLK': {
      title: 'Account Locked',
      message: 'Your account is temporarily locked due to multiple failed login attempts. Please try again after 10 minutes.',
      action: 'WAIT'
    },
    'PPE': {
      title: 'Password Expired',
      message: 'Your password has expired. Please reset it now to continue.',
      action: 'RESET_PASSWORD'
    },
    'INU': {
      title: 'Invalid Credentials',
      message: 'The Email ID or Password you entered is incorrect.',
      action: 'RETRY'
    },
    'LFT': {
      title: 'Session Expired',
      message: 'Your session has expired. Please login again.',
      action: 'REDIRECT_TO_LOGIN'
    },
    'UAU': {
      title: 'Unauthorized',
      message: 'You are not authorized to perform this action.',
      action: 'NONE'
    },
    'MRF': {
      title: 'Missing Information',
      message: 'Some required fields are missing. Please check your input.',
      action: 'RETRY'
    },
    'VLD': {
      title: 'Validation Error',
      message: 'Some fields contain invalid data. Please check and try again.',
      action: 'RETRY'
    },
    'ESNO': {
      title: 'System Error',
      message: 'An unexpected error occurred. Please try again later.',
      action: 'RETRY'
    },
    'UMF': {
      title: 'User Not Found',
      message: 'User not found in the system.',
      action: 'RETRY'
    },
    'EUA': {
      title: 'Email Already Exists',
      message: 'This email is already registered.',
      action: 'RETRY'
    },
    'IOT': {
      title: 'Invalid OTP',
      message: 'OTP is incorrect or has expired (5 minutes max).',
      action: 'RETRY'
    },
    'SAO': {
      title: 'Password Reuse',
      message: 'New password cannot be the same as your last 3 passwords.',
      action: 'RETRY'
    },
    'SLF0005': {
      title: 'User Not Found',
      message: 'Email ID does not exist. Please try using another email ID.',
      action: 'RETRY'
    },
    'SLF1001': {
      title: 'Login Error',
      message: 'Login failed. Please check your credentials.',
      action: 'RETRY'
    },
    'SLF2001': {
      title: 'OTP Error',
      message: 'Failed to send OTP. Please try again.',
      action: 'RETRY'
    },
    'SLF2002': {
      title: 'OTP Validation Failed',
      message: 'OTP is invalid or has expired. Please request a new one.',
      action: 'RETRY'
    },
    'SLF3001': {
      title: 'Password Reset Error',
      message: 'Failed to reset password. Please try again.',
      action: 'RETRY'
    },
    'RAL': {
      title: 'Role In Use',
      message: 'This role is currently assigned to users. Please reassign them first.',
      action: 'NONE'
    }
  };

  /**
   * Get error information from response code
   */
  getErrorInfo(code: string, message?: string): ErrorInfo {
    const errorInfo = this.errorCodeMap[code];
    
    if (errorInfo) {
      return errorInfo;
    }
    
    // Default error info
    return {
      title: 'Error',
      message: message || 'An error occurred. Please try again.',
      action: 'RETRY'
    };
  }

  /**
   * Format error message for display
   */
  formatErrorMessage(code: string, message?: string): string {
    const errorInfo = this.getErrorInfo(code, message);
    return `${errorInfo.title}: ${errorInfo.message}`;
  }
}
