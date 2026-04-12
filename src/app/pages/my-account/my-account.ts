import { Component, inject, OnInit } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SidebarService } from '../../services/sidebar.service';
import { IdentityService } from '../../services/identity.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [Sidebar, Navbar, CommonModule, FormsModule],
  templateUrl: './my-account.html',
  styleUrl: './my-account.css',
})
export class MyAccount implements OnInit {
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
    }
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
      },
      error: (err) => {
        this.saving = false;
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err.message || 'Something went wrong. Please try again.'
        });
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
      },
      error: (err) => {
        this.saving = false;
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err.message || 'Password change failed.'
        });
      }
    });
  }
}
