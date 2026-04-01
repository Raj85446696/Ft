import { Component, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-department',
  standalone: true,
  imports: [Sidebar, Navbar, CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-department.html',
  styleUrl: './edit-department.css',
})
export class EditDepartment {
  sidebarService = inject(SidebarService);

  // Pre-filled Form Model for Editing
  department = {
    name: 'Ministry of Health and Family Welfare',
    description: 'The Ministry of Health and Family Welfare is an Indian government ministry charged with health policy in India.',
    shortDescription: 'Government ministry for health policy.',
    type: 'Central',
    primaryCategory: 'Health',
    secondaryCategories: ['Medicine', 'Research'],
    searchKeywords: ['health', 'welfare', 'family', 'policy'],
    languages: ['English', 'Hindi'],
    address: 'Nirman Bhawan, Maulana Azad Road',
    state: 'Delhi',
    latitude: '28.6139',
    longitude: '77.2090',
    helpline: '1075',
    landPhone: '011-23061234',
    website: 'https://mohfw.gov.in',
    workingDays: 'Monday to Friday',
    weeklyHoliday: 'Saturday, Sunday',
    workingHours: '09:00 AM - 05:30 PM'
  };

  removeChip(array: string[], item: string) {
    const index = array.indexOf(item);
    if (index >= 0) {
      array.splice(index, 1);
    }
  }
}
