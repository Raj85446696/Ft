import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';

interface User {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  role: 'Admin' | 'User' | 'Manager';
  department: string;
  avatar?: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Sidebar],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  searchQuery = '';
  
  users: User[] = [
    {
      id: '1',
      name: 'Ritu Raj',
      email: 'rituraj@negd.gov.in',
      jobTitle: 'Senior Developer',
      role: 'Admin',
      department: 'IT & Telecom',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Amit Sharma',
      email: 'amit.sharma@gov.in',
      jobTitle: 'Project Manager',
      role: 'Manager',
      department: 'Finance',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Priya Verma',
      email: 'priya.v@care.gov.in',
      jobTitle: 'Operations Analyst',
      role: 'User',
      department: 'Operations',
      status: 'Active'
    },
    {
      id: '4',
      name: 'Suresh Kumar',
      email: 'suresh.k@it.nic.in',
      jobTitle: 'System Architect',
      role: 'Admin',
      department: 'IT',
      status: 'Inactive'
    },
    {
      id: '5',
      name: 'Anjali Gupta',
      email: 'anjali.g@health.gov.in',
      jobTitle: 'UX Researcher',
      role: 'User',
      department: 'Health',
      status: 'Active'
    }
  ];

  filteredUsers() {
    return this.users.filter(u => 
      u.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onDelete(user: User) {
    if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      this.users = this.users.filter(u => u.id !== user.id);
    }
  }

  onToggleStatus(user: User) {
    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
  }
}
