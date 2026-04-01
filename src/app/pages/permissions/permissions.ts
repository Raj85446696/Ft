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
  code: string;
  description: string;
  module: 'Dashboard' | 'Users' | 'Account' | 'Reports' | 'Security';
  assignedGroups: number;
}

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './permissions.html',
  styleUrl: './permissions.css'
})
export class PermissionsPage {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  searchQuery = '';
  
  permissionEntries: PermissionEntry[] = [
    {
      id: 'P001',
      name: 'View Analytics',
      code: 'ANALYTICS_VIEW',
      description: 'Ability to view high-level dashboard metrics and data visualizations.',
      module: 'Dashboard',
      assignedGroups: 12
    },
    {
      id: 'P002',
      name: 'Manage Users',
      code: 'USER_MANAGE',
      description: 'Create, update, and deactivate system user accounts.',
      module: 'Users',
      assignedGroups: 3
    },
    {
      id: 'P003',
      name: 'Edit Billing',
      code: 'BILLING_EDIT',
      description: 'Modify financial settings and subscription details.',
      module: 'Account',
      assignedGroups: 2
    },
    {
      id: 'P004',
      name: 'Export Reports',
      code: 'REPORT_EXPORT',
      description: 'Download data in PDF, CSV, or XML formats.',
      module: 'Reports',
      assignedGroups: 8
    },
    {
      id: 'P005',
      name: 'Security Audit',
      code: 'SECURITY_AUDIT_VIEW',
      description: 'View full system logs and security event histories.',
      module: 'Security',
      assignedGroups: 1
    }
  ];

  filteredPermissions() {
    return this.permissionEntries.filter(p => 
      p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      p.module.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onDelete(p: PermissionEntry) {
    if (confirm(`Remove defining permission "${p.name}"?`)) {
      this.permissionEntries = this.permissionEntries.filter(x => x.id !== p.id);
    }
  }
}
