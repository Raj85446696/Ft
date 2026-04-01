import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '../../../services/sidebar.service';
import { Navbar } from '../../../components/navbar/navbar';
import { Sidebar } from '../../../components/sidebar/sidebar';

@Component({
  selector: 'app-yearly-report',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './yearly-report.html',
  styleUrl: './yearly-report.css'
})
export class YearlyReport {
  sidebarService = inject(SidebarService);

  selectedYear = '2023';
  selectedMetric = 'Total Requests';
  
  years = ['2023', '2022', '2021', '2020'];
  metrics = ['Total Requests', 'Successful Transactions', 'Average Latency', 'User Satisfaction'];

  // Trend data for major ministries
  yearlyData = [
    { month: 'Jan', health: 45000, edu: 32000, fin: 55000 },
    { month: 'Feb', health: 48000, edu: 35000, fin: 58000 },
    { month: 'Mar', health: 52000, edu: 38000, fin: 62000 },
    { month: 'Apr', health: 50000, edu: 42000, fin: 60000 },
    { month: 'May', health: 55000, edu: 45000, fin: 65000 },
    { month: 'Jun', health: 58000, edu: 48000, fin: 68000 },
    { month: 'Jul', health: 62000, edu: 52000, fin: 72000 },
    { month: 'Aug', health: 65000, edu: 55000, fin: 75000 },
    { month: 'Sep', health: 60000, edu: 53000, fin: 70000 },
    { month: 'Oct', health: 68000, edu: 58000, fin: 80000 },
    { month: 'Nov', health: 72000, edu: 62000, fin: 85000 },
    { month: 'Dec', health: 75000, edu: 65000, fin: 90000 },
  ];

  ministryStats = [
    { name: 'Ministry of Health', total: '685,000', growth: '+15.2%', avg: '57,083', color: '#155dfc' },
    { name: 'Dept of Education', total: '510,000', growth: '+12.8%', avg: '42,500', color: '#10b981' },
    { name: 'Finance Division', total: '840,000', growth: '+18.5%', avg: '70,000', color: '#f59e0b' }
  ];

  exportReport() {
    console.log('Exporting Yearly Department Report for', this.selectedYear);
  }
}
