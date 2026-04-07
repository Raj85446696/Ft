import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Sidebar],
  templateUrl: './edit-service.html',
  styleUrl: './edit-service.css'
})
export class EditService {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  service = {
    department: 'Ministry of Health',
    title: 'Vaccination Certificate',
    description: 'Provides citizens with a secure, digital record of their vaccination history.',
    serviceId: 'SRV-88219-H',
    ownerCode: 'OWN-1102',
    category: 'Health',
    keywords: 'vaccine, health, certificate, covid',
    address1: 'Sector 42, Health Wing',
    address2: 'New Delhi, India',
    faq: 'https://health.gov.in/faq',
    tinyUrl: 'https://gov.in/vax',
    secretKey: 'vax-secret-12345',
    language: 'English',
    redirectApi: 'https://api.health.gov.in/v1/redirect',
    instanceId: 'INST-2026',
    dynamicPath: '/api/v1/vaccine/status',
    versionCode: '1.2.4',
    isActive: true
  };

  categories = ['Health', 'Education', 'Finance', 'Social Welfare', 'Agriculture', 'IT & Telecom'];
  departments = ['Ministry of Health', 'Digital India', 'NITI Aayog', 'Dept of Agriculture', 'Transport Department'];
  languages = ['English', 'Hindi', 'Bengali', 'Marathi', 'Gujarati', 'Tamil', 'Telugu'];

  onSubmit() {
    console.log('Service Edited:', this.service);
    // On success edit, we can navigate back to view or list
    this.router.navigate(['/app-inside/services']);
  }
}
