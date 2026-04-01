import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { Navbar } from '../../../components/navbar/navbar';
import { Sidebar } from '../../../components/sidebar/sidebar';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class Services {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  searchQuery: string = '';
  
  services = [
    {
      id: 1,
      name: 'Vaccination Certificate',
      category: 'Health',
      department: 'Ministry of Health',
      status: 'Active',
      icon: '/assets/vaccination_service_icon_1774859915087.png',
      gradient: 'linear-gradient(154.487deg, rgb(239, 246, 255) 0%, rgb(238, 242, 255) 100%)'
    },
    {
      id: 2,
      name: 'Admit Card Download',
      category: 'Education',
      department: 'Department of Education',
      status: 'Active',
      icon: '/assets/admit_card_service_icon_1774859932150.png',
      gradient: 'linear-gradient(154.487deg, rgb(239, 246, 255) 0%, rgb(238, 242, 255) 100%)'
    },
    {
      id: 3,
      name: 'Tax Filing',
      category: 'Finance',
      department: 'Finance Ministry',
      status: 'Active',
      icon: '/assets/tax_filing_service_icon_1774859963661.png',
      gradient: 'linear-gradient(154.487deg, rgb(239, 246, 255) 0%, rgb(238, 242, 255) 100%)'
    },
    {
      id: 4,
      name: 'Driving License',
      category: 'Transport',
      department: 'Transport Department',
      status: 'Active',
      icon: '/assets/driving_license_service_icon_1774859997176.png',
      gradient: 'linear-gradient(154.487deg, rgb(239, 246, 255) 0%, rgb(238, 242, 255) 100%)'
    },
    {
      id: 5,
      name: 'Electricity Bill',
      category: 'Utilities',
      department: 'Utilities & Services',
      status: 'Inactive',
      icon: '/assets/electricity_bill_service_icon_1774860029139.png',
      gradient: 'linear-gradient(154.487deg, rgb(239, 246, 255) 0%, rgb(238, 242, 255) 100%)'
    },
    {
      id: 6,
      name: 'Birth Certificate',
      category: 'Health',
      department: 'Ministry of Health',
      status: 'Active',
      icon: '/assets/vaccination_service_icon_1774859915087.png', // Fallback
      gradient: 'linear-gradient(154.487deg, rgb(239, 246, 255) 0%, rgb(238, 242, 255) 100%)'
    },
    {
      id: 7,
      name: 'Property Tax',
      category: 'Finance',
      department: 'Finance Ministry',
      status: 'Draft',
      icon: '/assets/tax_filing_service_icon_1774859963661.png', // Fallback
      gradient: 'linear-gradient(154.487deg, rgb(239, 246, 255) 0%, rgb(238, 242, 255) 100%)'
    }
  ];

  onAddService() {
    this.router.navigate(['/service-onboard']);
  }

  onView(service: any) {
    console.log('Viewing service:', service.name);
  }

  onEdit(service: any) {
    console.log('Editing service:', service.name);
  }
}
