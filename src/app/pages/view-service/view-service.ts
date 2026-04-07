import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-view-service',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar, Sidebar],
  templateUrl: './view-service.html',
  styleUrl: './view-service.css'
})
export class ViewService {
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
    secretKey: '••••••••••••••••',
    language: 'English',
    redirectApi: 'https://api.health.gov.in/v1/redirect',
    instanceId: 'INST-2026',
    dynamicPath: '/api/v1/vaccine/status',
    versionCode: '1.2.4',
    isActive: true
  };
}
