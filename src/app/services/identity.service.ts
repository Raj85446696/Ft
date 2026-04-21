import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

// Response Interfaces matching Identity Service API
export interface LoginV3Response {
  rs: string;  // S=Success, F=Failure
  rc: string;  // Response code
  rd: string;  // Response description
  pd?: {
    mailId: string;
    mno: string;
    token: string;
    firstLogin: string;
    pwdExpiry: string;
    rightChangeFlag: string;
    rights: Right[];
    commonRights: CommonRight[];
    apps: Application[];
    services: Service[];
    info: Info[];
    parent: Parent[];
    PreviousRights?: Right[];
  };
}

export interface Right {
  rightid: string;
  rightname: string;
  displayRightName: string;
  creationDate: string;
  rightCategoryId: string;
  rightCategoryName: string;
}

export interface CommonRight {
  rightId: string;
  creationDate: string;
  lastUpdatedDate: string;
}

export interface Application {
  appid: string;
  appname: string;
  cgid: string;
  cgname: string;
  creationdate: string;
  status: string;
  lastUpdatedDate: string;
  rights: string;
  dec: string;
  shortDes: string;
  alises: string;
  respMsg: string;
  image: string;
  lat: string;
  lon: string;
  url: string;
  contactAddress: string;
  website: string;
  contact: string;
  state: string;
  otherStates: string;
  workingHours: string;
}

export interface Service {
  appid: string;
  serviceid: string;
  servicename: string;
  status: string;
  longDes: string;
  shortDes: string;
  alises: string;
  image: string;
  url: string;
}

export interface Info {
  uid: string;
  userId: string;
  utype: string;
  mno: string;
  emailId: string;
  creationDate: string;
  orgName: string;
}

export interface Parent {
  parentId: string;
  parentName: string;
  parentEmail: string;
}

export interface LogoutResponse {
  rs: string;
  rc: string;
  rd: string;
}

export interface ValidateSessionResponse {
  rs: string;
  rc: string;
  rd: string;
  pd?: {
    userId: string;
    mailId: string;
    mno: string;
    status: string;
  };
}

export interface ApiResponse {
  rs: string;
  rc: string;
  rd: string;
  pd?: any;
}

export interface FetchChildUserResponse {
  rs: string;
  rc: string;
  rd: string;
  pd?: {
    app: ChildUser[];
  };
}

export interface ChildUser {
  uid: string;
  userid: string;
  email: string;
  mno: string;
  orgnztn: string;
  status: string;
  utype: string;
  state: string;
  cdate: string;
}

export interface FetchRightsResponse {
  rs: string;
  rc: string;
  rd: string;
  rights?: FetchedRight[];
}

export interface FetchedRight {
  rightid: string;
  rightnam: string;
  displayRightName: string;
  superAdmin: string;
  masterAdmin: string;
  masterAdminState: string;
  admin: string;
  child: string;
}

export interface FetchRolesResponse {
  rs: string;
  rc: string;
  rd: string;
  roles?: FetchedRole[];
}

export interface FetchedRole {
  roleId: string;
  roleName: string;
  status: string;
  cdate: string;
  rights: string; // comma-separated right IDs
}

export interface FetchUserResponse {
  rs: string;
  rc: string;
  rd: string;
  pd?: {
    app: FetchUserApp[];
  };
}

export interface FetchUserApp {
  uid: string;
  userId: string;
  email: string;
  rights: string | null; // comma-separated right IDs
  status: string;
  utype: string;
  orgnztn: string;
  mno: string | null;
  puser: string | null;
  cdate: string | null;
  ldate: string | null;
  estate: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  
  private apiUrl = environment.identityApiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Initialize user from localStorage (only in browser)
    if (this.isBrowser()) {
      const userProfile = this.getUserProfile();
      if (userProfile) {
        this.currentUserSubject.next(userProfile);
      }
    }
  }

  /**
   * Check if running in browser
   */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Login using V3 endpoint
   * @param userId - Email or username
   * @param password - Plain text password (backend will handle hashing)
   */
  login(userId: string, password: string): Observable<LoginV3Response> {
    const request = {
      userId: userId,
      pwd: password,  // Send plain text - backend uses BCrypt
      browser: navigator.userAgent,
      trkr: this.generateTracker(),
      lang: 'en'
    };

    return this.http.post<LoginV3Response>(`${this.apiUrl}/ws1/slfLoginV3`, request)
      .pipe(
        tap(response => {
          if (response.rs === 'S' && response.pd) {
            // Store token and user profile
            this.setToken(response.pd.token);
            this.setUserProfile(response.pd);
            this.currentUserSubject.next(response.pd);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<LogoutResponse> {
    const token = this.getToken();
    const request = {
      token: token,
      trkr: this.generateTracker()
    };

    return this.http.post<LogoutResponse>(`${this.apiUrl}/ws1/auth/lgout`, request)
      .pipe(
        tap(() => {
          this.clearSession();
        }),
        catchError(error => {
          // Clear session even if logout fails
          this.clearSession();
          return throwError(() => error);
        })
      );
  }

  /**
   * Validate current session
   */
  validateSession(): Observable<boolean> {
    const token = this.getToken();
    const userId = this.getUserId();

    if (!token || !userId) {
      return throwError(() => new Error('No active session'));
    }

    const request = {
      userId: userId,
      token: token,
      trkr: this.generateTracker()
    };

    return this.http.post<ValidateSessionResponse>(`${this.apiUrl}/ws1/slfValidateUserSession`, request)
      .pipe(
        map(response => response.rs === 'S'),
        catchError(() => {
          this.clearSession();
          return throwError(() => new Error('Session invalid'));
        })
      );
  }

  /**
   * Fetch child users (users under current admin)
   */
  fetchChildUsers(): Observable<FetchChildUserResponse> {
    const request = {
      lang: 'en',
      token: this.getToken(),
      app: '',
      category: '',
      rights: '',
      sdate: '',
      edate: '',
      trkr: this.generateTracker()
    };
    return this.http.post<FetchChildUserResponse>(`${this.apiUrl}/ws1/slffcu`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetch all users (admin — includes self-registered pending users)
   */
  fetchAllUsers(): Observable<FetchChildUserResponse> {
    const request = {
      lang: 'en',
      token: this.getToken(),
      app: '',
      category: '',
      rights: '',
      sdate: '',
      edate: '',
      trkr: this.generateTracker()
    };
    return this.http.post<FetchChildUserResponse>(`${this.apiUrl}/ws1/slffau`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Create a new user (Admin action)
   */
  createUser(userId: string, password: string, emailId: string, mno: string, organization: string, utype: string, state: string, commonRights: string): Observable<ApiResponse> {
    return this.createUserWithRoles(userId, password, emailId, mno, organization, utype, state, commonRights, [[]]);
  }

  /**
   * Create a new user with role assignments (Admin action)
   * app array format: [["", "", "roleId"], ...]
   */
  createUserWithRoles(userId: string, password: string, emailId: string, mno: string, organization: string, utype: string, state: string, commonRights: string, app: string[][]): Observable<ApiResponse> {
    const request = {
      userId,
      pwd: password,
      emailId,
      mno,
      signature: '',
      lang: 'en',
      utype,
      state,
      app,
      token: this.getToken(),
      organization,
      atype: '',
      rtype: '',
      commonRights,
      trkr: this.generateTracker()
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}/ws1/slfCreateUserV3`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update user status (activate/deactivate/suspend/delete)
   * Status: A=activate, I=deactivate, S=suspend, D=delete
   */
  updateUserStatus(userId: string, status: string, reason: string = ''): Observable<ApiResponse> {
    const request = {
      userId,
      status,
      reason,
      token: this.getToken(),
      lang: 'en',
      debug: '',
      trkr: this.generateTracker()
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}/ws1/slfuus`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a user
   */
  deleteUser(userId: string, reason: string = 'Removed by admin'): Observable<ApiResponse> {
    const request = {
      userId,
      reason,
      token: this.getToken(),
      lang: 'en',
      debug: '',
      trkr: this.generateTracker()
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}/ws1/slfdu`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetch all rights
   */
  fetchRights(): Observable<FetchRightsResponse> {
    const request = {
      right: '',
      lang: 'en',
      token: this.getToken(),
      trkr: this.generateTracker()
    };
    return this.http.post<FetchRightsResponse>(`${this.apiUrl}/ws1/slffetchrights`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetch all roles with their assigned right IDs
   */
  fetchRoles(): Observable<FetchRolesResponse> {
    const request = {
      lang: 'en',
      token: this.getToken(),
      trkr: this.generateTracker()
    };
    return this.http.post<FetchRolesResponse>(`${this.apiUrl}/ws1/slffetchroles`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Create a new role with assigned rights
   */
  createNewRole(roleName: string, rightIds: string, roleDesc: string = ''): Observable<ApiResponse> {
    const request = {
      roleName,
      roleId: rightIds,
      roleDesc,
      lang: 'en',
      token: this.getToken(),
      trkr: this.generateTracker()
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}/ws1/slfCreateRoleV3`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Edit an existing role's rights
   */
  editRole(roleId: string, rightIds: string): Observable<ApiResponse> {
    const request = {
      roleId,
      rightId: rightIds,
      lang: 'en',
      token: this.getToken(),
      trkr: this.generateTracker()
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}/ws1/slfEditRoleV3`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a role
   */
  deleteRole(roleId: string): Observable<ApiResponse> {
    const request = {
      roleId,
      lang: 'en',
      token: this.getToken(),
      trkr: this.generateTracker()
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}/ws1/slfDeleteRoleV3`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Assign role(s) to a user
   */
  assignRoleToUser(roleIds: string, userId: string): Observable<ApiResponse> {
    const request = {
      roleid: roleIds,
      userid: userId,
      lang: 'en',
      token: this.getToken(),
      trkr: this.generateTracker()
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}/ws1/slfanr`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Initiate OTP for password reset or verification
   */
  initOtp(userId: string, mno: string = ''): Observable<ApiResponse> {
    const request = {
      userId,
      mno,
      lang: 'en',
      trkr: this.generateTracker()
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}/ws1/slfinitotp`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Reset password using OTP (forgot password flow)
   */
  forgotPassword(userId: string, newpwd: string, otp: string): Observable<ApiResponse> {
    const request = {
      userId,
      newpwd,
      otp,
      lang: 'en',
      trkr: this.generateTracker()
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}/ws1/slffp`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Register organization / self-onboarding request
   */
  registerOrg(data: {
    name: string;
    email: string;
    mno: string;
    organization: string;
    stateCentral: string;
    emailOtp: string;
    mobileOtp?: string;
  }): Observable<ApiResponse> {
    const request = {
      ...data,
      mobileOrt: '',
      emailOrt: '',
      lang: 'en',
      trkr: this.generateTracker()
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}/ws1/slfrgt`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Reset password
   */
  resetPassword(uname: string, oldpwd: string, newpwd: string): Observable<ApiResponse> {
    const request = {
      uname,
      oldpwd,
      newpwd,
      lang: 'en',
      token: this.getToken(),
      trkr: this.generateTracker()
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}/ws1/slfrp`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Generate unique tracker ID
   */
  private generateTracker(): string {
    return 'TRK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Store authentication token
   */
  private setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('authToken', token);
    }
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Store user profile
   */
  private setUserProfile(profile: any): void {
    if (this.isBrowser()) {
      const serialized = JSON.stringify(profile);
      sessionStorage.setItem('userProfile', serialized);
      localStorage.setItem('userProfile', serialized);
      localStorage.setItem('userId', profile.mailId || '');
    }
  }

  getUserProfile(): any | null {
    if (this.isBrowser()) {
      const profile = sessionStorage.getItem('userProfile') || localStorage.getItem('userProfile');
      return profile ? JSON.parse(profile) : null;
    }
    return null;
  }

  /**
   * Get user ID
   */
  private getUserId(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('userId');
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user has specific right
   */
  hasRight(rightName: string): boolean {
    const profile = this.getUserProfile();
    if (!profile || !profile.rights) {
      return false;
    }
    return profile.rights.some((right: Right) => right.rightname === rightName);
  }

  /**
   * Check if user is admin (admin, superadmin, or masteradmin)
   */
  isAdmin(): boolean {
    const profile = this.getUserProfile();
    if (!profile || !profile.info || !profile.info.length) {
      return false;
    }
    const utype = (profile.info[0].utype || '').toLowerCase();
    return ['admin', 'superadmin', 'masteradmin', 'super_admin', 'master_admin'].includes(utype);
  }

  /**
   * Clear session data
   */
  private clearSession(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userProfile');
      sessionStorage.removeItem('userProfile');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Fetch a specific user's details (uid, rights, etc.)
   */
  fetchUserDetails(userId: string): Observable<FetchUserResponse> {
    const request = {
      userId,
      token: this.getToken(),
      lang: 'en',
      trkr: this.generateTracker()
    };
    return this.http.post<FetchUserResponse>(`${this.apiUrl}/ws1/slffetch`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Edit user rights (replaces all existing rights)
   * uid: numeric user ID, commonRights: comma-separated right IDs
   */
  editUserRights(uid: string, commonRights: string): Observable<ApiResponse> {
    const request = {
      uId: uid,
      appRights: [],
      commonRights,
      token: this.getToken(),
      lang: 'en',
      trkr: this.generateTracker()
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}/ws1/slfEditUserRightsV3`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Assign app-level rights to a user for a specific department/application.
   * Sends appRights + existing commonRights together (V3 replaces both atomically).
   */
  assignAppRights(userId: string, appId: string, rightIds: string[], commonRights: string): Observable<ApiResponse> {
    const appRights = rightIds.map(rightId => ({ appid: appId, rightid: rightId }));
    const request = {
      uId: userId,
      appRights,
      commonRights,
      token: this.getToken(),
      lang: 'en',
      trkr: this.generateTracker()
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}/ws1/slfEditUserRightsV3`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update own profile (mobile number, signature)
   */
  updateProfile(mno: string, signature: string): Observable<ApiResponse> {
    const request = {
      token: this.getToken(),
      mno,
      signature,
      trkr: this.generateTracker(),
      lang: 'en'
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}/ws1/slfUpdateProfile`, request)
      .pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = (error.error && error.error.rd)
        ? error.error.rd
        : `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('Identity Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
