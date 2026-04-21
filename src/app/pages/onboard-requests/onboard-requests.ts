import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { IdentityService, ChildUser } from '../../services/identity.service';
import Swal from 'sweetalert2';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './onboard-requests.html',
  styleUrl: './onboard-requests.css'
})
export class OnboardRequests implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  identityService = inject(IdentityService);

  activeTab: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
  searchQuery = '';
  requests: OnboardRequest[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.errorMessage = '';
    this.identityService.fetchAllUsers().subscribe({
      next: (response) => {
        if (response.rs === 'S' && response.pd?.app) {
          this.requests = response.pd.app
            .filter(u => (u.utype || '').toLowerCase() === 'registered')
            .map(u => this.mapToRequest(u));
        } else {
          this.errorMessage = response.rd || 'Failed to load requests';
        }
        this.loading = false;
            this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load requests: ' + (err.message || 'Unknown error');
        this.loading = false;
          this.cdr.detectChanges();
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
    Swal.fire({
      title: 'Approve Request?',
      text: `Approve onboard request for ${request.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#155dfc',
      confirmButtonText: 'Approve'
    }).then((result) => {
      if (result.isConfirmed) {
        this.identityService.updateUserStatus(request.email, 'active', 'Approved by admin').subscribe({
          next: (response) => {
            if (response.rs === 'S') {
              request.status = 'Approved';
              Swal.fire('Approved', 'User approved successfully!', 'success');
            } else {
              Swal.fire('Error', response.rd || 'Failed to approve request', 'error');
            }
                this.cdr.detectChanges();
          },
          error: () => {
            Swal.fire('Error', 'Failed to approve user', 'error');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  onReject(request: OnboardRequest) {
    Swal.fire({
      title: 'Reject Request?',
      text: `Reject and remove onboard request for ${request.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Reject'
    }).then((result) => {
      if (result.isConfirmed) {
        this.identityService.deleteUser(request.email, 'Rejected by admin').subscribe({
          next: (response) => {
            if (response.rs === 'S') {
              this.requests = this.requests.filter(r => r.email !== request.email);
              Swal.fire('Rejected', 'Onboard request rejected and user removed.', 'success');
            } else {
              Swal.fire('Error', response.rd || 'Failed to reject request', 'error');
            }
                this.cdr.detectChanges();
          },
          error: () => {
            Swal.fire('Error', 'Failed to reject user', 'error');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }
}
