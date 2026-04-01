import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { Navbar } from '../../../components/navbar/navbar';
import { Sidebar } from '../../../components/sidebar/sidebar';

interface SentEmail {
  id: string;
  subject: string;
  recipients: string;
  date: string;
  status: 'Delivered' | 'Failed' | 'Scheduled';
  openRate: string;
}

@Component({
  selector: 'app-view-email',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Sidebar],
  templateUrl: './view-email.html',
  styleUrl: './view-email.css'
})
export class ViewEmailPage {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  searchQuery = '';
  
  emails: SentEmail[] = [
    {
      id: 'EM-001',
      subject: 'Security Policy Update - Ministry Hub',
      recipients: 'all-admins@gov.in',
      date: 'Mar 28, 2024, 10:30 AM',
      status: 'Delivered',
      openRate: '84%'
    },
    {
      id: 'EM-002',
      subject: 'Weekly Performance Report - Feb Week 4',
      recipients: 'dept-heads@negd.gov.in',
      date: 'Mar 27, 2024, 09:15 AM',
      status: 'Delivered',
      openRate: '92%'
    },
    {
      id: 'EM-003',
      subject: 'System Maintenance - Downtime Alert',
      recipients: 'technical-staff@it.nic.in',
      date: 'Mar 26, 2024, 04:45 PM',
      status: 'Failed',
      openRate: '0%'
    },
    {
      id: 'EM-004',
      subject: 'Monthly Newsletter - Service Plus Insights',
      recipients: 'all-users@care.gov.in',
      date: 'Mar 31, 2024, 10:00 AM',
      status: 'Scheduled',
      openRate: '--'
    }
  ];

  filteredEmails() {
    return this.emails.filter(e => 
      e.subject.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      e.recipients.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onExport(email: SentEmail) {
    alert(`Exporting delivery report for: ${email.subject}`);
  }
}
