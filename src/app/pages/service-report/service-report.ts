import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-report.html',
  styleUrl: './service-report.css',
})
export class ServiceReport {
  sidebarService = inject(SidebarService);

  // Figma Assets Mapping
  imgIconExport = "/assets/ef6847adaf2d3600a68ce18a848656343f3cc25782.svg"; // Correcting hash based on context
  imgIconGrowth = "/assets/bd1b0de85c6685401e449064ad375d2c16eeb9d8.svg"; // Growth arrow

  topServices = [
    { rank: 1, name: 'Tax Filing', users: '15,600', growth: '+18%', growthColor: '#00a63e' },
    { rank: 2, name: 'Vaccination Certificate', users: '12,500', growth: '+12%', growthColor: '#00a63e' },
    { rank: 3, name: 'Admit Card Download', users: '8,900', growth: '+8%', growthColor: '#00a63e' },
    { rank: 4, name: 'Driving License', users: '6,700', growth: '+5%', growthColor: '#00a63e' },
    { rank: 5, name: 'Electricity Bill', users: '4,200', growth: '+3%', growthColor: '#00a63e' }
  ];

  cumulativeStats = [
    { title: 'Total Service Requests', value: '89,456', bg: '#eff6ff', textColor: '#155dfc' },
    { title: 'Completed Requests', value: '84,231', bg: '#f0fdf4', textColor: '#00a63e' },
    { title: 'Average Response Time', value: '2.4 hrs', bg: '#fefce8', textColor: '#854d0e' }
  ];

  lastMonthUsage = [
    { name: 'Taxation', hits: 5500, height: '85%' },
    { name: 'Admit Card', hits: 4200, height: '65%' },
    { name: 'Tax Filing', hits: 5800, height: '90%' },
    { name: 'Driving License', hits: 3100, height: '45%' },
    { name: 'Electricity', hits: 3900, height: '60%' }
  ];

  exportReport() {
    const rows = [
      ['Rank', 'Service Name', 'Users', 'Growth'],
      ...this.topServices.map(s => [s.rank, s.name, s.users, s.growth])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'service-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
