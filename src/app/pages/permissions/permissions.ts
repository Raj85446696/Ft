import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { IdentityService } from '../../services/identity.service';
import Swal from 'sweetalert2';

interface PermissionEntry {
  id: string;
  name: string;
  tag: string;
  description: string;
  module: 'Dashboard & Analytics' | 'User Management' | 'Department Management' | 'Service Management' | 'System Administration';
  enabled: boolean;
}

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './permissions.html',
  styleUrl: './permissions.css'
})
export class PermissionsPage implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  identityService = inject(IdentityService);
  
  permissionEntries: PermissionEntry[] = [];
  loading = false;
  currentRole: any = null;
  rolePermissions: string[] = [];

  constructor() {
    // Read router state in constructor — getCurrentNavigation() is null by ngOnInit
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['role']) {
      this.currentRole = nav.extras.state['role'];
      this.rolePermissions = this.currentRole.permissions || [];
    }
  }

  ngOnInit() {
    // Fallback: read from history.state (Angular stores router state here)
    if (!this.currentRole) {
      const state = history.state;
      if (state?.role) {
        this.currentRole = state.role;
        this.rolePermissions = this.currentRole.permissions || [];
      }
    }

    if (!this.currentRole) {
      this.router.navigate(['/role-management']);
      return;
    }

    this.loadPermissions();
  }

  loadPermissions() {
    this.loading = true;
    this.identityService.fetchRights().subscribe({
      next: (response) => {
        if (response.rs === 'S' && response.rights && response.rights.length > 0) {
          this.permissionEntries = response.rights.map(r => ({
            id: r.rightid,
            name: r.displayRightName || r.rightnam,
            tag: this.mapRightToTag(r.displayRightName || r.rightnam),
            description: r.rightnam,
            module: this.mapRightToModule(r.displayRightName || r.rightnam),
            enabled: this.rolePermissions.includes(r.rightid)
          }));
        } else {
          // API failed or returned empty — use rights from login session as fallback
          this.loadPermissionsFromSession();
        }
        this.loading = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.loadPermissionsFromSession();
        this.loading = false;
          this.cdr.detectChanges();
      }
    });
  }

  private loadPermissionsFromSession() {
    const profile = this.identityService.getUserProfile();
    if (profile?.rights && profile.rights.length > 0) {
      this.permissionEntries = profile.rights.map((r: any) => ({
        id: r.rightid,
        name: r.displayRightName || r.rightname,
        tag: this.mapRightToTag(r.displayRightName || r.rightname),
        description: r.rightname,
        module: this.mapRightToModule(r.displayRightName || r.rightname),
        enabled: this.rolePermissions.includes(r.rightid)
      }));
    }
  }

  private mapRightToTag(rightName: string): string {
    const lower = rightName.toLowerCase();
    if (lower.includes('dashboard') || lower.includes('report')) return 'dashboard';
    if (lower.includes('user')) return 'users';
    if (lower.includes('department')) return 'departments';
    if (lower.includes('service')) return 'services';
    return 'system';
  }

  private mapRightToModule(rightName: string): 'Dashboard & Analytics' | 'User Management' | 'Department Management' | 'Service Management' | 'System Administration' {
    const lower = rightName.toLowerCase();
    
    // Map based on old system categories
    if (lower.includes('app') || lower.includes('service') || lower.includes('activate') || lower.includes('deactivate') || lower.includes('directory') || lower.includes('analytics') || lower.includes('api') || lower.includes('payment')) {
      return 'Service Management';
    }
    if (lower.includes('profile') || lower.includes('keyword') || lower.includes('category') || lower.includes('techspoc') || lower.includes('report card')) {
      return 'Service Management';
    }
    if (lower.includes('complaint')) {
      return 'User Management';
    }
    if (lower.includes('banner')) {
      return 'System Administration';
    }
    if (lower.includes('notification') || lower.includes('attention') || lower.includes('campaign')) {
      return 'System Administration';
    }
    if (lower.includes('user') || lower.includes('subuser') || lower.includes('onboarding') || lower.includes('questionaire') || lower.includes('timeline') || lower.includes('interim') || lower.includes('maker') || lower.includes('control')) {
      return 'User Management';
    }
    if (lower.includes('rating') || lower.includes('feedback')) {
      return 'Dashboard & Analytics';
    }
    if (lower.includes('department')) {
      return 'Department Management';
    }
    
    return 'System Administration';
  }

  get modules() {
    const mods = new Set(this.permissionEntries.map(p => p.module));
    return Array.from(mods);
  }

  getPermissionsByModule(mod: string) {
    return this.permissionEntries.filter(p => p.module === mod);
  }

  get enabledCount() {
    return this.permissionEntries.filter(p => p.enabled).length;
  }

  get coverage() {
    if (this.permissionEntries.length === 0) return 0;
    return Math.round((this.enabledCount / this.permissionEntries.length) * 100);
  }

  togglePermission(p: PermissionEntry) {
    p.enabled = !p.enabled;
    // Update rolePermissions array
    if (p.enabled) {
      if (!this.rolePermissions.includes(p.id)) {
        this.rolePermissions.push(p.id);
      }
    } else {
      const idx = this.rolePermissions.indexOf(p.id);
      if (idx !== -1) {
        this.rolePermissions.splice(idx, 1);
      }
    }
  }

  savePermissions() {
    if (!this.currentRole) {
      Swal.fire('Validation', 'No role selected', 'warning');
      return;
    }

    const rightIds = this.rolePermissions.join(',');

    this.identityService.editRole(this.currentRole.id, rightIds).subscribe({
      next: (response) => {
        if (response.rs === 'S') {
          Swal.fire('Saved', 'Permissions updated successfully!', 'success').then(() => {
            this.router.navigate(['/role-management']);
          });
        } else {
          Swal.fire('Error', response.rd || 'Failed to update permissions', 'error');
        }
            this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire('Error', 'Failed to update permissions', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  get roleName(): string {
    return this.currentRole?.name || 'Unknown Role';
  }
}
