import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { IdentityService, FetchedRight } from '../../services/identity.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface AssignedAppPermission {
  appId: string;
  appName: string;
  permissions: string[];
}

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-account.html',
  styleUrl: './my-account.css',
})
export class MyAccount implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  identityService = inject(IdentityService);

  userInfo = {
    email: '',
    mobile: '',
    adminMobile: '',
    password: '••••••••',
    signature: '',
    adminEmail: '',
    organization: '',
    utype: '',
    uid: '',
    creationDate: ''
  };

  assignedApps: string[] = [];
  assignedAppPermissions: AssignedAppPermission[] = [];
  private rightNameMap = new Map<string, string>();

  // Edit state
  editingField: string | null = null;
  editMobile = '';
  editSignature = '';
  saving = false;
  successMessage = '';
  errorMessage = '';

  // Password change
  showPasswordModal = false;
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  ngOnInit() {
    this.loadProfile();
    this.loadRightCatalog();
  }

  loadProfile() {
    const profile = this.identityService.getUserProfile();
    if (profile) {
      this.userInfo.email = profile.mailId || '';
      this.userInfo.mobile = profile.mno || '';

      if (profile.info?.length) {
        const info = profile.info[0];
        this.userInfo.uid = info.uid || '';
        this.userInfo.organization = info.orgName || '';
        this.userInfo.utype = info.utype || '';
        this.userInfo.creationDate = info.creationDate || '';
        this.userInfo.mobile = info.mno || profile.mno || '';
        this.userInfo.adminEmail = info.emailId || profile.mailId || '';
        this.userInfo.adminMobile = info.mno || profile.mno || '';
      } else {
        this.userInfo.adminMobile = profile.mno || '';
        this.userInfo.adminEmail = profile.mailId || '';
      }

      if (profile.parent?.length) {
        const parent = profile.parent[0];
        this.userInfo.adminEmail = parent.puserId || this.userInfo.adminEmail;
      }

      if (profile.apps?.length) {
        this.assignedApps = profile.apps.map((app: { appname: string }) => app.appname).filter(Boolean);
      }

      this.assignedAppPermissions = this.buildAssignedAppPermissions(profile);
      if (this.assignedApps.length === 0 && this.assignedAppPermissions.length > 0) {
        this.assignedApps = this.assignedAppPermissions.map(app => app.appName);
      }
    }
  }

  loadRightCatalog() {
    this.identityService.fetchRights().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.rights?.length) {
          this.rightNameMap = new Map(
            res.rights.map((right: FetchedRight) => [
              right.rightid,
              right.displayRightName || right.rightnam || `Permission ${right.rightid}`
            ])
          );
          this.assignedAppPermissions = this.assignedAppPermissions.map(app => ({
            ...app,
            permissions: app.permissions.map(permission => this.rightNameMap.get(permission) || permission)
          }));
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      }
    });
  }

  private buildAssignedAppPermissions(profile: any): AssignedAppPermission[] {
    const appsById = new Map<string, AssignedAppPermission>();
    const appNameById = new Map<string, string>();

    if (Array.isArray(profile?.apps)) {
      profile.apps.forEach((app: any) => {
        const appId = String(app?.appid || app?.appId || '').trim();
        const appName = String(app?.appname || app?.appName || '').trim();
        const rights = this.parseRights(app?.rights);

        if (appId) {
          appNameById.set(appId, appName || `App ${appId}`);
        }

        if (appId || appName) {
          const key = appId || appName;
          appsById.set(key, {
            appId: appId || key,
            appName: appName || `App ${appId || key}`,
            permissions: this.mapRightIdsToNames(rights)
          });
        }
      });
    }

    const previousRights = profile?.previousRights || profile?.PreviousRights || [];
    if (Array.isArray(previousRights)) {
      previousRights.forEach((entry: any) => {
        const appId = String(entry?.app || '').trim();
        if (!appId) return;

        const permissionNames = this.mapRightIdsToNames(this.parseRights(entry?.rights));
        const existing = appsById.get(appId);
        const appName = appNameById.get(appId) || `App ${appId}`;

        if (existing) {
          existing.permissions = Array.from(new Set([...existing.permissions, ...permissionNames]));
          if (!existing.appName || existing.appName === `App ${appId}`) {
            existing.appName = appName;
          }
        } else {
          appsById.set(appId, {
            appId,
            appName,
            permissions: permissionNames
          });
        }
      });
    }

    return Array.from(appsById.values());
  }

  private parseRights(rights: unknown): string[] {
    if (typeof rights !== 'string' || !rights.trim()) return [];
    return rights.split(',').map(id => id.trim()).filter(Boolean);
  }

  private mapRightIdsToNames(rightIds: string[]): string[] {
    return Array.from(new Set(
      rightIds.map(rightId => this.rightNameMap.get(rightId) || rightId)
    ));
  }

  startEdit(field: string) {
    this.editingField = field;
    this.successMessage = '';
    this.errorMessage = '';
    if (field === 'mobile') {
      this.editMobile = this.userInfo.mobile;
    } else if (field === 'signature') {
      this.editSignature = this.userInfo.signature;
    }
  }

  cancelEdit() {
    this.editingField = null;
  }

  saveField() {
    if (!this.editingField) return;
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const mno = this.editingField === 'mobile' ? this.editMobile : this.userInfo.mobile;
    const signature = this.editingField === 'signature' ? this.editSignature : this.userInfo.signature;

    this.identityService.updateProfile(mno, signature).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.rs === 'S') {
          if (this.editingField === 'mobile') {
            this.userInfo.mobile = this.editMobile;
            this.userInfo.adminMobile = this.editMobile;
          } else if (this.editingField === 'signature') {
            this.userInfo.signature = this.editSignature;
          }
          this.editingField = null;
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Your profile has been updated successfully.',
            timer: 2500,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: res.rd || 'Something went wrong. Please try again.'
          });
        }
            this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err.message || 'Something went wrong. Please try again.'
        });
          this.cdr.detectChanges();
      }
    });
  }

  openPasswordModal() {
    this.showPasswordModal = true;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  closePasswordModal() {
    this.showPasswordModal = false;
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      Swal.fire({ icon: 'warning', title: 'Mismatch', text: 'New passwords do not match.' });
      return;
    }
    if (this.newPassword.length < 8) {
      Swal.fire({ icon: 'warning', title: 'Too Short', text: 'Password must be at least 8 characters.' });
      return;
    }
    this.saving = true;
    this.errorMessage = '';

    this.identityService.resetPassword(this.userInfo.email, this.oldPassword, this.newPassword).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.rs === 'S') {
          this.showPasswordModal = false;
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: 'Password Changed!',
              text: 'Your password has been updated successfully.',
              timer: 2500,
              showConfirmButton: false
            });
          }, 200);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: res.rd || 'Password change failed.'
          });
        }
            this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err.message || 'Password change failed.'
        });
          this.cdr.detectChanges();
      }
    });
  }
}
