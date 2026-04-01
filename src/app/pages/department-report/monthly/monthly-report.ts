import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '../../../services/sidebar.service';

import { Navbar } from '../../../components/navbar/navbar';
import { Sidebar } from '../../../components/sidebar/sidebar';

@Component({
  selector: 'app-monthly-report',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './monthly-report.html',
  styleUrl: './monthly-report.css'
})
export class MonthlyReport {
  sidebarService = inject(SidebarService);

  filters = {
    month: 'January',
    year: '2024',
    department: 'All Departments'
  };

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years = ['2024', '2023', '2022'];
  departments = ['All Departments', 'Finance', 'Health', 'Education', 'Utilities', 'Transport'];

  // Mock data for the chart
  chartData = [
    { name: 'Finance', jan: 5500, feb: 5200 },
    { name: 'Health', jan: 4800, feb: 4500 },
    { name: 'Education', jan: 4200, feb: 4000 },
    { name: 'Utilities', jan: 3600, feb: 3300 },
    { name: 'Transport', jan: 3100, feb: 2800 }
  ];

  topDepartments = [
    { id: 1, name: 'Finance', value: '5,500' },
    { id: 2, name: 'Health', value: '4,800' },
    { id: 3, name: 'Education', value: '4,200' },
    { id: 4, name: 'Utilities', value: '3,600' },
    { id: 5, name: 'Transport', value: '3,100' }
  ];

  summaryStats = [
    { label: 'Total Requests This Month', value: '21,200', change: '+8.2%', type: 'info' },
    { label: 'Growth vs Last Month', value: '+8.2%', change: '', type: 'success' },
    { label: 'Average per Department', value: '4,240', change: '', type: 'purple' }
  ];

  exportReport() {
    console.log('Exporting Monthly Department Report...');
  }
}
