import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../../services/sidebar.service';
import { Navbar } from '../../../../components/navbar/navbar';
import { Sidebar } from '../../../../components/sidebar/sidebar';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Sidebar],
  templateUrl: './create-group.html',
  styleUrl: './create-group.css'
})
export class CreateGroup {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  group = {
    name: '',
    description: '',
    departments: [] as string[],
    permissions: [] as string[]
  };

  departments = ['IT', 'Operations', 'Health', 'Education', 'Finance', 'Audit', 'External'];
  permissions = [
    { id: 'read', label: 'Read Access', description: 'Can view dashboards and reports' },
    { id: 'write', label: 'Write Access', description: 'Can edit and create records' },
    { id: 'delete', label: 'Delete Access', description: 'Can remove data permanently' },
    { id: 'admin', label: 'Admin Access', description: 'Full system configuration' }
  ];

  toggleDepartment(dept: string) {
    const index = this.group.departments.indexOf(dept);
    if (index === -1) {
      this.group.departments.push(dept);
    } else {
      this.group.departments.splice(index, 1);
    }
  }

  togglePermission(permId: string) {
    const index = this.group.permissions.indexOf(permId);
    if (index === -1) {
      this.group.permissions.push(permId);
    } else {
      this.group.permissions.splice(index, 1);
    }
  }

  onSubmit() {
    console.log('Group Created:', this.group);
    // Navigate back to the list
    this.router.navigate(['/app-inside/manage-group']);
  }
}
