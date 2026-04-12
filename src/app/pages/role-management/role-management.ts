import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { IdentityService, FetchedRight } from '../../services/identity.service';

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[]; // List of right IDs
  color: string;
  icon: string;
}

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './role-management.html',
  styleUrl: './role-management.css'
})
export class RoleManagement implements OnInit {
  sidebarService = inject(SidebarService);
  router = inject(Router);
  identityService = inject(IdentityService);

  roles: Role[] = [];
  allPermissions: Permission[] = [];
  loading = false;

  selectedRole: Role | null = null;
  editingPermissions: string[] = [];

  // Modal State
  isCreateModalOpen = false;
  isPermissionsModalOpen = false;
  newRoleName = '';
  newRoleDesc = '';
  newRoleColor = '#3B82F6';
  newRoleRights: string[] = [];
  themeColors = ['#EF4444', '#3B82F6', '#10B981', '#A855F7', '#F97316', '#EC4899'];

  private roleColors = ['#155dfc', '#7c3aed', '#101828', '#d97706', '#15803d', '#b91c1c', '#0891b2', '#c026d3'];
  private roleIcons = ['admin_panel_settings', 'manage_accounts', 'person', 'visibility', 'security', 'shield', 'verified_user', 'group'];

  ngOnInit() {
    this.loadPermissions();
    this.loadRoles();
  }

  loadRoles() {
    this.identityService.fetchRoles().subscribe({
      next: (response) => {
        if (response.rs === 'S' && response.roles) {
          this.roles = response.roles.map((r, i) => ({
            id: r.roleId,
            name: r.roleName || `Role ${r.roleId}`,
            description: `Role ID: ${r.roleId}`,
            userCount: 0,
            permissions: r.rights ? r.rights.split(',').filter(id => id.trim()) : [],
            color: this.roleColors[i % this.roleColors.length],
            icon: this.roleIcons[i % this.roleIcons.length]
          }));
          if (this.roles.length > 0 && !this.selectedRole) {
            this.selectedRole = this.roles[0];
          }
        }
      },
      error: (err) => console.error('Error loading roles:', err)
    });
  }

  loadPermissions() {
    this.loading = true;
    this.identityService.fetchRights().subscribe({
      next: (response) => {
        if (response.rs === 'S' && response.rights) {
          this.allPermissions = response.rights.map(r => ({
            id: r.rightid,
            name: r.displayRightName || r.rightnam,
            description: `Permission: ${r.rightnam}`,
            enabled: true
          }));
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading permissions:', err);
        this.loading = false;
      }
    });
  }

  selectRole(role: Role) {
    this.selectedRole = role;
  }

  navigateToPermissions(role: Role) {
    this.router.navigate(['/permissions'], {
      state: { role: role }
    });
  }

  openPermissionsModal(role: Role) {
    this.selectedRole = role;
    this.editingPermissions = [...role.permissions];
    this.isPermissionsModalOpen = true;
  }

  closePermissionsModal() {
    this.isPermissionsModalOpen = false;
  }

  toggleEditingPermission(rightId: string) {
    const idx = this.editingPermissions.indexOf(rightId);
    if (idx === -1) {
      this.editingPermissions.push(rightId);
    } else {
      this.editingPermissions.splice(idx, 1);
    }
  }

  isEditingPermissionEnabled(rightId: string): boolean {
    return this.editingPermissions.includes(rightId);
  }

  isPermissionEnabled(permissionId: string): boolean {
    return this.selectedRole?.permissions.includes(permissionId) || false;
  }

  togglePermission(permissionId: string) {
    if (!this.selectedRole) return;
    const index = this.selectedRole.permissions.indexOf(permissionId);
    if (index === -1) {
      this.selectedRole.permissions.push(permissionId);
    } else {
      this.selectedRole.permissions.splice(index, 1);
    }
  }

  // Modal Actions
  openCreateModal() {
    this.newRoleName = '';
    this.newRoleDesc = '';
    this.newRoleColor = '#3B82F6';
    this.newRoleRights = [];
    this.isCreateModalOpen = true;
  }

  toggleNewRoleRight(rightId: string) {
    const idx = this.newRoleRights.indexOf(rightId);
    if (idx === -1) {
      this.newRoleRights.push(rightId);
    } else {
      this.newRoleRights.splice(idx, 1);
    }
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  selectThemeColor(color: string) {
    this.newRoleColor = color;
  }

  createRole() {
    if (!this.newRoleName.trim()) {
      alert('Please fill role name');
      return;
    }
    
    if (this.newRoleRights.length === 0) {
      alert('Please select at least one permission');
      return;
    }
    const rightIds = this.newRoleRights.join(',');
    
    this.identityService.createNewRole(this.newRoleName, rightIds, '').subscribe({
      next: (response) => {
        if (response.rs === 'S') {
          alert('Role created successfully!');
          this.closeCreateModal();
          this.loadRoles(); // Reload from backend
        } else {
          alert('Failed to create role: ' + response.rd);
        }
      },
      error: (err) => {
        alert('Error creating role: ' + err.message);
        console.error('Create role error:', err);
      }
    });
  }

  deleteSelectedRole() {
    if (!this.selectedRole) return;
    
    if (confirm(`Are you sure you want to delete role "${this.selectedRole.name}"?`)) {
      this.identityService.deleteRole(this.selectedRole.id).subscribe({
        next: (response) => {
          if (response.rs === 'S') {
            this.roles = this.roles.filter(r => r.id !== this.selectedRole?.id);
            this.selectedRole = this.roles[0] || null;
            alert('Role deleted successfully!');
          } else {
            alert('Failed to delete role: ' + response.rd);
          }
        },
        error: (err) => {
          alert('Error deleting role: ' + err.message);
          console.error('Delete role error:', err);
        }
      });
    }
  }

  saveRolePermissions() {
    if (!this.selectedRole) return;
    
    const rightIds = this.editingPermissions.join(',');
    
    this.identityService.editRole(this.selectedRole.id, rightIds).subscribe({
      next: (response) => {
        if (response.rs === 'S') {
          this.selectedRole!.permissions = [...this.editingPermissions];
          alert('Role permissions updated successfully!');
          this.closePermissionsModal();
          this.loadRoles();
        } else {
          alert('Failed to update role: ' + response.rd);
        }
      },
      error: (err) => {
        alert('Error updating role: ' + err.message);
        console.error('Update role error:', err);
      }
    });
  }
}
