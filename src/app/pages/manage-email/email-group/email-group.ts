import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';

interface EmailGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  status: 'Active' | 'Inactive';
  lastUsed: string;
}

@Component({
  selector: 'app-email-group',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-group.html',
  styleUrl: './email-group.css'
})
export class EmailGroupPage {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  searchQuery = '';
  
  groups: EmailGroup[] = [
    {
      id: 'G001',
      name: 'Department Heads',
      description: 'Communication channel for all ministry level heads.',
      memberCount: 24,
      status: 'Active',
      lastUsed: '2 hours ago'
    },
    {
      id: 'G002',
      name: 'IT Support Team',
      description: 'Quick broadcast for technical issues and updates.',
      memberCount: 12,
      status: 'Active',
      lastUsed: 'Yesterday'
    },
    {
      id: 'G003',
      name: 'Finance Approvers',
      description: 'Exclusive group for processing budget approvals.',
      memberCount: 8,
      status: 'Active',
      lastUsed: '3 days ago'
    },
    {
      id: 'G004',
      name: 'External Partners',
      description: 'Liaison group for third party contractors.',
      memberCount: 45,
      status: 'Inactive',
      lastUsed: '2 weeks ago'
    }
  ];

  filteredGroups() {
    return this.groups.filter(g => 
      g.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onDelete(group: EmailGroup) {
    if (confirm(`Remove email group "${group.name}"?`)) {
      this.groups = this.groups.filter(g => g.id !== group.id);
    }
  }

  onToggleStatus(group: EmailGroup) {
    group.status = group.status === 'Active' ? 'Inactive' : 'Active';
  }
}
