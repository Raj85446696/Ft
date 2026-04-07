import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';

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
  permissions: string[]; // List of permission IDs
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
export class RoleManagement {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  roles: Role[] = [
    {
      id: 'R01',
      name: 'System Admin',
      description: 'Full access to all system configurations and management.',
      userCount: 4,
      permissions: ['P01', 'P02', 'P03', 'P04'],
      color: '#155dfc',
      icon: 'admin_panel_settings'
    },
    {
      id: 'R02',
      name: 'Department Manager',
      description: 'Manage departmental users, reports, and service configurations.',
      userCount: 12,
      permissions: ['P01', 'P03'],
      color: '#7c3aed',
      icon: 'manage_accounts'
    },
    {
      id: 'R03',
      name: 'Standard User',
      description: 'Access to general services and basic reporting.',
      userCount: 156,
      permissions: ['P01'],
      color: '#101828',
      icon: 'person'
    },
    {
      id: 'R04',
      name: 'Auditor',
      description: 'Read-only access to specific system reports and logs.',
      userCount: 8,
      permissions: ['P04'],
      color: '#d97706',
      icon: 'visibility'
    }
  ];

  allPermissions: Permission[] = [
    { id: 'P01', name: 'Dashboard View', description: 'Access to metrics and analytics dashboard', enabled: true },
    { id: 'P02', name: 'User Management', description: 'Create, edit, and delete system users', enabled: true },
    { id: 'P03', name: 'Service Configuration', description: 'Manage backend integrations and API settings', enabled: true },
    { id: 'P04', name: 'Audit Logs', description: 'View system-level security and access logs', enabled: true }
  ];

  selectedRole: Role | null = this.roles[0];

  // Modal State
  isCreateModalOpen = false;
  newRoleName = '';
  newRoleDesc = '';
  newRoleColor = '#3B82F6';
  themeColors = ['#EF4444', '#3B82F6', '#10B981', '#A855F7', '#F97316', '#EC4899'];

  selectRole(role: Role) {
    this.selectedRole = role;
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
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  selectThemeColor(color: string) {
    this.newRoleColor = color;
  }

  createRole() {
    if (!this.newRoleName.trim() || !this.newRoleDesc.trim()) return;
    
    const newRole: Role = {
      id: 'R' + Object.keys(this.roles).length + 1,
      name: this.newRoleName,
      description: this.newRoleDesc,
      userCount: 0,
      permissions: [],
      color: this.newRoleColor,
      icon: 'admin_panel_settings' // Default icon
    };

    this.roles.push(newRole);
    this.closeCreateModal();
  }
}
