import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';

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
export class OnboardRequests {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  activeTab: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
  searchQuery = '';
  
  requests: OnboardRequest[] = [
    {
      id: 'REQ-001',
      name: 'Ritu Raj',
      email: 'rituraj@negd.gov.in',
      department: 'IT & Telecom',
      date: 'Mar 25, 2024',
      status: 'Pending'
    },
    {
      id: 'REQ-002',
      name: 'Amit Sharma',
      email: 'amit.s@gov.in',
      department: 'Finance',
      date: 'Mar 24, 2024',
      status: 'Pending'
    },
    {
      id: 'REQ-003',
      name: 'Priya Verma',
      email: 'priya.v@care.gov.in',
      department: 'Operations',
      date: 'Mar 22, 2024',
      status: 'Approved'
    },
    {
      id: 'REQ-004',
      name: 'Suresh Kumar',
      email: 'suresh.k@it.nic.in',
      department: 'IT Support',
      date: 'Mar 20, 2024',
      status: 'Rejected'
    }
  ];

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
      request.status = 'Approved';
    }
  }

  onReject(request: OnboardRequest) {
    if (confirm(`Reject onboard request for ${request.name}?`)) {
      request.status = 'Rejected';
    }
  }
}
