import { Component, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-department',
  standalone: true,
  imports: [Sidebar, Navbar, CommonModule, FormsModule, RouterLink],
  templateUrl: './view-department.html',
  styleUrl: './view-department.css',
})
export class ViewDepartment {
  sidebarService = inject(SidebarService);

  // Mock predefined data to view
  department = {
    name: 'Ministry of Health and Family Welfare',
    description: 'The Ministry of Health and Family Welfare is an Indian government ministry charged with health policy in India.',
    shortDescription: 'Government ministry for health policy.',
    type: 'Central Government',
    primaryCategory: 'Health',
    secondaryCategory: 'Medicine, Research',
    keywords: 'health, welfare, family, policy',
    languages: 'English, Hindi',
    address: 'Nirman Bhawan, Maulana Azad Road',
    state: 'Delhi',
    latitude: '28.6139',
    longitude: '77.2090',
    helpline: '1075',
    landphone: '011-23061234',
    email: 'contact@mohfw.gov.in',
    website: 'https://mohfw.gov.in',
    workingHours: '09:00 AM - 05:30 PM',
    workingDays: 'Monday to Friday',
    weeklyHoliday: 'Saturday, Sunday'
  };
}
