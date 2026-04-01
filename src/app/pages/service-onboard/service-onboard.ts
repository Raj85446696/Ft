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

  currentStep: number = 1;
  service = {
    name: '',
    category: '',
    department: '',
    description: '',
    slug: '',
    ownerName: '',
    ownerEmail: '',
    languages: [] as string[],
    type: 'External',
    authMethod: 'API Key',
    responseFormat: 'JSON',
    endpoints: {
      dev: '',
      prod: ''
    },
    privacyPolicy: '',
    termsInfo: ''
  };

  categories = ['Health', 'Education', 'Finance', 'Social Welfare', 'Agriculture', 'IT & Telecom'];
  departments = ['Ministry of Health', 'Digital India', 'NITI Aayog', 'Dept of Agriculture'];
  availableLanguages = ['English', 'Hindi', 'Bengali', 'Marathi', 'Gujarati', 'Tamil', 'Telugu'];

  toggleLanguage(lang: string) {
    const index = this.service.languages.indexOf(lang);
    if (index === -1) {
      this.service.languages.push(lang);
    } else {
      this.service.languages.splice(index, 1);
    }
  }

  nextStep() {
    if (this.currentStep < 3) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  onSubmit() {
    console.log('Service Onboarded:', this.service);
    this.router.navigate(['/app-inside/services']);
  }
}
