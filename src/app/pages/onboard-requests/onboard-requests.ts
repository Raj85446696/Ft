import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { IdentityService, ChildUser } from '../../services/identity.service';

interface OnboardRequest {
  id: string;
  name: string;
  email: string;
  department: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  avatar?: string;
}

@Component({
  selector: 'app-onboard-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './onboard-requests.html',
  styleUrl: './onboard-requests.css'
})
export class OnboardRequests implements OnInit {
  sidebarService = inject(SidebarService);
  router = inject(Router);
  identityService = inject(IdentityService);

  activeTab: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
  searchQuery = '';
  requests: OnboardRequest[] = [];
  loading = false;

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.identityService.fetchAllUsers().subscribe({
      next: (response) => {
        if (response.rs === 'S' && response.pd?.app) {
          this.requests = response.pd.app
            .filter(u => (u.utype || '').toLowerCase() === 'registered')
            .map(u => this.mapToRequest(u));
        } else {
          console.error('Failed to load requests:', response.rd);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading requests:', err);
        this.loading = false;
      }
    });
  }

  private mapToRequest(user: ChildUser): OnboardRequest {
    let status: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
    const st = (user.status || '').toLowerCase();
    if (st === 'active') status = 'Approved';
    else if (st === 'inactive' || st === 'deactive' || st === 'blocked') status = 'Rejected';
    // 'pending' and 'registered' remain Pending

    return {
      id: user.uid,
      name: user.userid,
      email: user.email,
      department: user.orgnztn || '-',
      date: user.cdate ? new Date(user.cdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
      status
    };
  }

  get pendingCount() { return this.requests.filter(r => r.status === 'Pending').length; }
  get approvedCount() { return this.requests.filter(r => r.status === 'Approved').length; }
  get rejectedCount() { return this.requests.filter(r => r.status === 'Rejected').length; }

  filteredRequests() {
    return this.requests.filter(r => 
      r.status === this.activeTab &&
      (r.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
       r.email.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  setTab(tab: any) {
    this.activeTab = tab;
  }

  onApprove(request: OnboardRequest) {
    if (confirm(`Approve onboard request for ${request.name}?`)) {
      this.identityService.updateUserStatus(request.email, 'active', 'Approved by admin').subscribe({
        next: (response) => {
          if (response.rs === 'S') {
            request.status = 'Approved';
            alert('User approved successfully!');
          } else {
            alert('Failed to approve: ' + response.rd);
          }
        },
        error: (err) => {
          alert('Error approving user: ' + err.message);
          console.error('Approve error:', err);
        }
      });
    }
  }

  onReject(request: OnboardRequest) {
    if (confirm(`Reject and remove onboard request for ${request.name}?`)) {
      this.identityService.deleteUser(request.email, 'Rejected by admin').subscribe({
        next: (response) => {
          if (response.rs === 'S') {
            this.requests = this.requests.filter(r => r.email !== request.email);
            alert('Onboard request rejected and user removed.');
          } else {
            alert('Failed to reject: ' + response.rd);
          }
        },
        error: (err) => {
          alert('Error rejecting user: ' + err.message);
          console.error('Reject error:', err);
        }
      });
    }
  }
}
