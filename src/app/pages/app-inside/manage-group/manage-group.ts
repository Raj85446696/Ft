import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { Navbar } from '../../../components/navbar/navbar';
import { Sidebar } from '../../../components/sidebar/sidebar';

interface Group {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  departments: string[];
  createdAt: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-manage-group',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Sidebar],
  templateUrl: './manage-group.html',
  styleUrl: './manage-group.css'
})
export class ManageGroup {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  searchQuery = '';
  
  groups: Group[] = [
    {
      id: '1',
      name: 'Admin Group',
      description: 'Full access to all system modules and settings.',
      membersCount: 12,
      departments: ['IT', 'Operations'],
      createdAt: '2025-01-15',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Department Heads',
      description: 'Access to department reports and staff management.',
      membersCount: 45,
      departments: ['Health', 'Education', 'Finance'],
      createdAt: '2025-02-10',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Support Team',
      description: 'View only access to tickets and user feedback.',
      membersCount: 8,
      departments: ['Customer Support'],
      createdAt: '2025-03-05',
      status: 'Active'
    },
    {
      id: '4',
      name: 'External Audit',
      description: 'Restricted access to financial logs and compliance.',
      membersCount: 3,
      departments: ['Audit', 'External'],
      createdAt: '2025-03-20',
      status: 'Inactive'
    }
  ];

  onDelete(group: Group) {
    if (confirm(`Are you sure you want to delete group "${group.name}"?`)) {
      this.groups = this.groups.filter(g => g.id !== group.id);
    }
  }

  onToggleStatus(group: Group) {
    group.status = group.status === 'Active' ? 'Inactive' : 'Active';
  }
}
