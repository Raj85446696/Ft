import { Component, inject, signal } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-partner-report',
  standalone: true,
  imports: [Sidebar, Navbar, CommonModule, FormsModule],
  templateUrl: './partner-report.html',
  styleUrl: './partner-report.css',
})
export class PartnerReport {
  sidebarService = inject(SidebarService);

  stats = [
    { title: 'Total Partners', value: '1,245', icon: 'handshake', color: '#155dfc' },
    { title: 'Active Partners', value: '986', icon: 'check_circle', color: '#00c950' },
    { title: 'Pending Approval', value: '145', icon: 'pending', color: '#ffcc00' },
    { title: 'Rejected Requests', value: '114', icon: 'cancel', color: '#ff2d55' }
  ];

  categoryData = [
    { label: 'Ministry', value: '45.2%', color: '#155dfc', partners: 562 },
    { label: 'Department', value: '34.8%', color: '#00c950', partners: 433 },
    { label: 'Independent Entity', value: '20.0%', color: '#ffcc00', partners: 250 }
  ];

  monthlyTrend = [
    { month: 'Sep', value: 45 },
    { month: 'Oct', value: 58 },
    { month: 'Nov', value: 42 },
    { month: 'Dec', value: 75 },
    { month: 'Jan', value: 89 },
    { month: 'Feb', value: 112 }
  ];

  partnerList = [
    { name: 'Ministry of Finance', category: 'Ministry', date: 'Feb 15, 2024', status: 'Active', impact: 'Critical' },
    { name: 'Dept of Revenue', category: 'Department', date: 'Feb 12, 2024', status: 'Active', impact: 'High' },
    { name: 'National Highway Authority', category: 'Independent Entity', date: 'Feb 10, 2024', status: 'Pending', impact: 'Medium' },
    { name: 'Ministry of Education', category: 'Ministry', date: 'Feb 08, 2024', status: 'Active', impact: 'High' },
    { name: 'CSIR Research', category: 'Independent Entity', date: 'Feb 05, 2024', status: 'Rejected', impact: 'Low' }
  ];

  exportReport() {
    console.log('Exporting Partner Onboarding Report...');
  }
}
