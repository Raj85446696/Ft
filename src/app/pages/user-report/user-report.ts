import { Component, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-report',
  standalone: true,
  imports: [Sidebar, Navbar, CommonModule, FormsModule],
  templateUrl: './user-report.html',
  styleUrl: './user-report.css',
})
export class UserReport {
  sidebarService = inject(SidebarService);

  // Figma Assets (Using existing hashes if available, or descriptive names)
  imgIconFilter = "/assets/1d5f81856a034e43390fa905445b462061af4d31.svg"; // Filter icon
  imgIconUsers = "/assets/3e0d164c964e16c4928433681d9f0fe26f27c82a.svg"; // Users icon
  imgIconCalendar = "/assets/6c9614ed2999a1cebe9e868ba0b4bcc824b066ec.svg"; // Calendar
  imgIconPlatform = "/assets/45c0d2f0393c4077f0847dfa97b26a35625b716d.svg"; // Platform icon
  imgIconDown = "/assets/38e1c9e8829c4c91e81a903bb65366f92b7beffa.svg"; // Down arrow
  
  imgAndroid = "/assets/1998396d40c1b6fb1a551468bf4274b19e6d335d.svg";
  imgIos = "/assets/7548c0ab9f021aff37480c5678c8da2b95582612.svg";
  imgLogo = "/assets/umang-logo.png";

  filters = {
    platform: 'All',
    qualification: 'All',
    gender: 'All',
    dateFrom: '',
    dateTo: '',
    state: ''
  };

  stats = [
    { title: 'Total Users', value: '1,24,567', icon: 'people', color: '#155dfc' },
    { title: 'Active Users', value: '98,245', icon: 'person_add', color: '#00c950' },
    { title: 'Platform Usage', value: '3 Platforms', icon: 'devices', color: '#8200db' },
    { title: 'Active Sessions', value: '8,542', icon: 'bolt', color: '#ff9500' }
  ];

  stateData = [
    { name: 'Maharashtra', total: '25,000', active: '18,500', percentage: '20.1%', color: '#155dfc' },
    { name: 'Delhi', total: '18,000', active: '14,200', percentage: '14.5%', color: '#00c950' },
    { name: 'Karnataka', total: '15,000', active: '11,800', percentage: '12.0%', color: '#8200db' },
    { name: 'Tamil Nadu', total: '12,000', active: '9,200', percentage: '9.6%', color: '#ff3b30' },
    { name: 'Gujarat', total: '10,000', active: '7,800', percentage: '8.0%', color: '#007aff' }
  ];

  sessionData = [
    { name: 'Rajesh Kumar', platform: 'Android', state: 'Maharashtra', loginTime: '2024-02-27 09:45 AM', lastActivity: '2 min ago', status: 'Active' },
    { name: 'Priya Sharma', platform: 'iOS', state: 'Delhi', loginTime: '2024-02-27 10:12 AM', lastActivity: '5 min ago', status: 'Active' },
    { name: 'Amit Patel', platform: 'Web', state: 'Gujarat', loginTime: '2024-02-27 08:30 AM', lastActivity: '1 min ago', status: 'Active' },
    { name: 'Sneha Reddy', platform: 'Android', state: 'Karnataka', loginTime: '2024-02-27 11:05 AM', lastActivity: '8 min ago', status: 'Active' },
    { name: 'Vikram Singh', platform: 'iOS', state: 'Rajasthan', loginTime: '2024-02-27 09:20 AM', lastActivity: '3 min ago', status: 'Active' }
  ];

  qualificationData = [
    { label: 'Graduate', value: '45,000', percentage: '36%', color: '#155dfc' },
    { label: 'Post Graduate', value: '33,234', percentage: '27%', color: '#00c950' },
    { label: 'Diploma', value: '25,000', percentage: '20%', color: '#ffcc00' },
    { label: 'PhD', value: '12,000', percentage: '10%', color: '#ff2d55' },
    { label: 'Other', value: '9,333', percentage: '7%', color: '#8200db' }
  ];

  genderData = [
    { label: 'Male', percentage: '54.6%', color: '#155dfc' },
    { label: 'Female', percentage: '41.7%', color: '#ff2d55' },
    { label: 'Other', percentage: '2.9%', color: '#00c950' },
    { label: 'Prefer Not to Say', percentage: '0.8%', color: '#8e8e93' }
  ];

  applyFilters() {
    console.log('Applying filters:', this.filters);
  }

  resetFilters() {
    this.filters = { platform: 'All', qualification: 'All', gender: 'All', dateFrom: '', dateTo: '', state: '' };
  }

  exportReport() {
    console.log('Exporting report...');
  }
}
