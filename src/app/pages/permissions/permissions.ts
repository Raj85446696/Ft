import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';

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
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Sidebar],
  templateUrl: './permissions.html',
  styleUrl: './permissions.css'
})
export class PermissionsPage {
  sidebarService = inject(SidebarService);
  router = inject(Router);
  
  permissionEntries: PermissionEntry[] = [
    {
      id: 'P01',
      name: 'View Dashboard',
      tag: 'dashboard',
      description: 'Access to main dashboard and analytics',
      module: 'Dashboard & Analytics',
      enabled: true
    },
    {
      id: 'P02',
      name: 'View Reports',
      tag: 'dashboard',
      description: 'Access to all reports and statistics',
      module: 'Dashboard & Analytics',
      enabled: true
    },
    {
      id: 'P03',
      name: 'Create Reports',
      tag: 'dashboard',
      description: 'Generate custom reports',
      module: 'Dashboard & Analytics',
      enabled: false
    },
    {
      id: 'P04',
      name: 'Export Reports',
      tag: 'dashboard',
      description: 'Download and export report data',
      module: 'Dashboard & Analytics',
      enabled: true
    },
    {
      id: 'P05',
      name: 'View Users',
      tag: 'users',
      description: 'View user list and details',
      module: 'User Management',
      enabled: true
    },
    {
      id: 'P06',
      name: 'Create Users',
      tag: 'users',
      description: 'Add new users to the system',
      module: 'User Management',
      enabled: true
    },
    {
      id: 'P07',
      name: 'Edit Users',
      tag: 'users',
      description: 'Modify user information',
      module: 'User Management',
      enabled: true
    },
    {
      id: 'P08',
      name: 'Delete Users',
      tag: 'users',
      description: 'Remove users from the system',
      module: 'User Management',
      enabled: false
    },
    {
      id: 'P09',
      name: 'View Departments',
      tag: 'departments',
      description: 'Access department information',
      module: 'Department Management',
      enabled: true
    },
    {
      id: 'P10',
      name: 'Create Departments',
      tag: 'departments',
      description: 'Add new departments',
      module: 'Department Management',
      enabled: true
    },
    {
      id: 'P11',
      name: 'System Settings',
      tag: 'system',
      description: 'Modify system configuration',
      module: 'System Administration',
      enabled: false
    },
    {
      id: 'P12',
      name: 'Manage Roles',
      tag: 'system',
      description: 'Create and edit user roles',
      module: 'System Administration',
      enabled: false
    }
  ];

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
  }
}
