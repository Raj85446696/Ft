import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-service-onboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Sidebar],
  templateUrl: './service-onboard.html',
  styleUrl: './service-onboard.css'
})
export class ServiceOnboard {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  service = {
    department: '',
    title: '',
    description: '',
    serviceId: '',
    ownerCode: '',
    category: '',
    keywords: '',
    address1: '',
    address2: '',
    faq: '',
    tinyUrl: '',
    secretKey: '',
    language: 'English',
    redirectApi: '',
    instanceId: '',
    dynamicPath: '',
    versionCode: '',
    isActive: true
  };

  categories = ['Health', 'Education', 'Finance', 'Social Welfare', 'Agriculture', 'IT & Telecom'];
  departments = ['Ministry of Health', 'Digital India', 'NITI Aayog', 'Dept of Agriculture'];
  languages = ['English', 'Hindi', 'Bengali', 'Marathi', 'Gujarati', 'Tamil', 'Telugu'];

  onSubmit() {
    console.log('Service Onboarded:', this.service);
    this.router.navigate(['/app-inside/services']);
  }
}
