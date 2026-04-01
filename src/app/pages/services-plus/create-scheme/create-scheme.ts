import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { Navbar } from '../../../components/navbar/navbar';
import { Sidebar } from '../../../components/sidebar/sidebar';

@Component({
  selector: 'app-create-scheme',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Sidebar],
  templateUrl: './create-scheme.html',
  styleUrl: './create-scheme.css'
})
export class CreateScheme {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  scheme = {
    name: '',
    code: '',
    department: '',
    category: '',
    description: '',
    beneficiaryType: 'Individual',
    launchYear: '2024',
    status: 'Draft',
    guidelines: ''
  };

  categories = ['Health', 'Education', 'Social Welfare', 'Agriculture', 'Urban Development', 'Finance'];
  departments = ['Ministry of Health', 'Digital India', 'Ministry of Finance', 'Social Justice'];
  beneficiaryTypes = ['Individual', 'Family', 'Community', 'Organization'];

  onSubmit() {
    console.log('Scheme Created:', this.scheme);
    this.router.navigate(['/services-plus/manage-scheme']);
  }
}
