import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { IdentityService, FetchedRight, FetchedRole } from '../../../services/identity.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css'
})
export class CreateUser implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  identityService = inject(IdentityService);

  user = {
    email: '',
    mobile: '',
    organization: '',
    state: '',
    utype: 'user'
  };

  userTypes = [
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' },
    { label: 'User', value: 'user' },
    { label: 'Registered', value: 'registered' }
  ];

  states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];

  // Roles & Rights from API
  availableRoles: FetchedRole[] = [];
  availableRights: FetchedRight[] = [];
  selectedRoleIds: string[] = [];
  selectedRightIds: string[] = [];
  rolesLoading = false;
  rightsLoading = false;

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.loadRoles();
    this.loadRights();
  }

  loadRoles() {
    this.rolesLoading = true;
    this.identityService.fetchRoles().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.roles) {
          this.availableRoles = res.roles;
        }
        this.rolesLoading = false;
            this.cdr.detectChanges();
      },
      error: () => { this.rolesLoading = false;
          this.cdr.detectChanges(); }
    });
  }

  loadRights() {
    this.rightsLoading = true;
    this.identityService.fetchRights().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.rights) {
          this.availableRights = res.rights;
        }
        this.rightsLoading = false;
            this.cdr.detectChanges();
      },
      error: () => { this.rightsLoading = false;
          this.cdr.detectChanges(); }
    });
  }

  toggleRole(roleId: string) {
    const idx = this.selectedRoleIds.indexOf(roleId);
    if (idx === -1) {
      this.selectedRoleIds.push(roleId);
    } else {
      this.selectedRoleIds.splice(idx, 1);
    }
  }

  toggleRight(rightId: string) {
    const idx = this.selectedRightIds.indexOf(rightId);
    if (idx === -1) {
      this.selectedRightIds.push(rightId);
    } else {
      this.selectedRightIds.splice(idx, 1);
    }
  }

  allRightsSelected(): boolean {
    return this.availableRights.length > 0 && this.selectedRightIds.length === this.availableRights.length;
  }

  toggleAllRights() {
    if (this.allRightsSelected()) {
      this.selectedRightIds = [];
    } else {
      this.selectedRightIds = this.availableRights.map(r => r.rightid);
    }
  }

  private generatePassword(length = 12): string {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '@#$!&';
    const all = upper + lower + digits + special;
    // Ensure at least one of each type
    let pwd = upper[Math.floor(Math.random() * upper.length)]
            + lower[Math.floor(Math.random() * lower.length)]
            + digits[Math.floor(Math.random() * digits.length)]
            + special[Math.floor(Math.random() * special.length)];
    for (let i = pwd.length; i < length; i++) {
      pwd += all[Math.floor(Math.random() * all.length)];
    }
    // Shuffle
    return pwd.split('').sort(() => Math.random() - 0.5).join('');
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.user.email?.trim()) {
      this.errorMessage = 'Email is required';
      return;
    }
    if (!this.user.mobile?.trim()) {
      this.errorMessage = 'Mobile number is required';
      return;
    }
    if (!this.user.organization?.trim()) {
      this.errorMessage = 'Organization name is required';
      return;
    }
    if (!this.user.state) {
      this.errorMessage = 'Please select a state';
      return;
    }

    this.isSubmitting = true;

    const tempPassword = this.generatePassword();
    const commonRights = this.selectedRightIds.join(',');
    // Build app array for role assignment: [["", "", "roleId"], ...]
    const app: string[][] = this.selectedRoleIds.map(rid => ['', '', rid]);
    if (app.length === 0) {
      app.push([]); // backend expects at least [[]]
    }

    this.identityService.createUserWithRoles(
      this.user.email,
      tempPassword,
      this.user.email,
      this.user.mobile,
      this.user.organization,
      this.user.utype,
      this.user.state,
      commonRights,
      app
    ).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.rs === 'S') {
          this.successMessage = 'User created! Credentials sent to ' + this.user.email;
          setTimeout(() => this.router.navigate(['/user-management']), 2000);
        } else {
          this.errorMessage = response.rd || 'Failed to create user';
        }
            this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.message || 'Error creating user';
          this.cdr.detectChanges();
      }
    });
  }
}
