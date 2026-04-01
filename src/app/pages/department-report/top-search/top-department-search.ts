import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '../../../services/sidebar.service';
import { Navbar } from '../../../components/navbar/navbar';
import { Sidebar } from '../../../components/sidebar/sidebar';

@Component({
  selector: 'app-top-department-search',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './top-department-search.html',
  styleUrl: './top-department-search.css'
})
export class TopDepartmentSearch {
  sidebarService = inject(SidebarService);

  summaryStats = [
    { title: 'Total Searches', value: '80,650', icon: 'search', color: '#2b7fff' },
    { title: 'Growth This Month', value: '+12.4%', icon: 'trending_up', color: '#00c950', isPositive: true },
    { title: 'Unique Terms', value: '1,245', icon: 'history', color: '#ad46ff' },
    { title: 'Avg per Day', value: '2,688', icon: 'today', color: '#ff6900' }
  ];

  topSearchTerms = [
    { rank: 1, name: 'Vaccination Certificate', category: 'Health', hits: '15,420', growth: '+12%', color: '#f0b100' },
    { rank: 2, name: 'Tax Filing', category: 'Finance', hits: '12,850', growth: '+18%', color: '#99a1af' },
    { rank: 3, name: 'Admit Card', category: 'Education', hits: '11,240', growth: '+8%', color: '#f54900' },
    { rank: 4, name: 'Driving License', category: 'Transport', hits: '9,560', growth: '+5%', color: '#155dfc' },
    { rank: 5, name: 'Electricity Bill', category: 'Utilities', hits: '8,320', growth: '+15%', color: '#155dfc' },
    { rank: 6, name: 'Passport Application', category: 'Home Affairs', hits: '7,890', growth: '+22%', color: '#155dfc' },
    { rank: 7, name: 'PAN Card', category: 'Finance', hits: '7,240', growth: '+10%', color: '#155dfc' },
    { rank: 8, name: 'Birth Certificate', category: 'Municipal', hits: '6,850', growth: '+7%', color: '#155dfc' },
    { rank: 9, name: 'Property Tax', category: 'Municipal', hits: '6,120', growth: '+9%', color: '#155dfc' },
    { rank: 10, name: 'Ration Card', category: 'Food & Supply', hits: '5,640', growth: '+14%', color: '#155dfc' }
  ];

  distributionData = [
    { name: 'Finance', total: '20,090', percentage: '25%', width: '25%' },
    { name: 'Health', total: '15,420', percentage: '19%', width: '19%' },
    { name: 'Education', total: '11,240', percentage: '14%', width: '14%' },
    { name: 'Municipal', total: '12,970', percentage: '16%', width: '16%' },
    { name: 'Transport', total: '9,560', percentage: '12%', width: '12%' },
    { name: 'Others', total: '11,370', percentage: '14%', width: '14%' }
  ];

  viewDetails(term: any) {
    console.log('Viewing details for:', term.name);
  }
}
