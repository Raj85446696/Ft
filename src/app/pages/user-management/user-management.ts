import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { IdentityService, ChildUser } from '../../services/identity.service';

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  department: string;
  state: string;
  avatar?: string;
  status: 'Active' | 'Inactive';
  createdDate: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Sidebar],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  sidebarService = inject(SidebarService);
  router = inject(Router);
  identityService = inject(IdentityService);

  searchQuery = '';
  users: User[] = [];
  loading = false;
  errorMessage = '';

  // Pagination
  currentPage = 1;
  pageSize = 12;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.errorMessage = '';
    
    this.identityService.fetchAllUsers().subscribe({
      next: (response) => {
        if (response.rs === 'S' && response.pd?.app) {
          // Exclude pending users (handled by onboard-requests)
          this.users = response.pd.app
            .filter(u => (u.status || '').toLowerCase() !== 'pending')
            .map(u => this.mapToUser(u));
        } else {
          this.errorMessage = response.rd || 'Failed to load users';
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading users: ' + (err.message || 'Unknown error');
        this.loading = false;
        console.error('Load users error:', err);
      }
    });
  }

  private mapToUser(apiUser: ChildUser): User {
    const utype = (apiUser.utype || '').toLowerCase();
    let role = 'User';
    if (utype.includes('superadmin') || utype.includes('super_admin')) role = 'Super Admin';
    else if (utype.includes('masteradmin') || utype.includes('master_admin')) role = 'Master Admin';
    else if (utype.includes('admin')) role = 'Admin';
    else if (utype.includes('manager')) role = 'Manager';
    else if (utype === 'registered') role = 'Registered';

    return {
      id: apiUser.uid,
      name: apiUser.userid,
      email: apiUser.email,
      mobile: apiUser.mno || '',
      role,
      department: apiUser.orgnztn || '-',
      state: apiUser.state || '-',
      status: apiUser.status === 'active' ? 'Active' : 'Inactive',
      createdDate: apiUser.cdate || ''
    };
  }

  // Stats computed from actual data
  get totalUsers() { return this.users.length; }
  get adminCount() { return this.users.filter(u => u.role.toLowerCase().includes('admin')).length; }
  get activeCount() { return this.users.filter(u => u.status === 'Active').length; }
  get inactiveCount() { return this.users.filter(u => u.status === 'Inactive').length; }
  
  filteredUsers() {
    return this.users.filter(u => 
      u.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Pagination
  get totalPages() { return Math.max(1, Math.ceil(this.filteredUsers().length / this.pageSize)); }
  get pageNumbers() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers().slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onDelete(user: User) {
    if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      this.identityService.deleteUser(user.email).subscribe({
        next: (response) => {
          if (response.rs === 'S') {
            this.users = this.users.filter(u => u.id !== user.id);
            alert('User deleted successfully');
          } else {
            alert('Delete failed: ' + response.rd);
          }
        },
        error: (err) => {
          alert('Error deleting user: ' + err.message);
          console.error('Delete user error:', err);
        }
      });
    }
  }

  onToggleStatus(user: User) {
    const newStatus = user.status === 'Active' ? 'deactive' : 'active';
    const newStatusText = user.status === 'Active' ? 'deactivate' : 'activate';
    
    if (confirm(`Are you sure you want to ${newStatusText} user "${user.name}"?`)) {
      this.identityService.updateUserStatus(user.email, newStatus, `${newStatusText}d by admin`).subscribe({
        next: (response) => {
          if (response.rs === 'S') {
            user.status = user.status === 'Active' ? 'Inactive' : 'Active';
          } else {
            alert('Status update failed: ' + response.rd);
          }
        },
        error: (err) => {
          alert('Error updating status: ' + err.message);
          console.error('Update status error:', err);
        }
      });
    }
  }
}
