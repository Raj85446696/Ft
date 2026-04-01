import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { Navbar } from '../../../components/navbar/navbar';
import { Sidebar } from '../../../components/sidebar/sidebar';

interface Scheme {
  id: string;
  name: string;
  code: string;
  department: string;
  description: string;
  status: 'Active' | 'Draft' | 'Archived';
  lastUpdated: string;
}

@Component({
  selector: 'app-manage-scheme',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Sidebar],
  templateUrl: './manage-scheme.html',
  styleUrl: './manage-scheme.css'
})
export class ManageScheme {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  searchQuery = '';
  
  schemes: Scheme[] = [
    {
      id: 'S001',
      name: 'Direct Benefit Transfer (DBT)',
      code: 'DBT-GOI-2024',
      department: 'Finance Ministry',
      description: 'Transferring subsidies directly to the bank accounts of beneficiaries.',
      status: 'Active',
      lastUpdated: '2024-03-20'
    },
    {
      id: 'S002',
      name: 'Ayushman Bharat',
      code: 'AB-PMJAY-01',
      department: 'Ministry of Health',
      description: 'India\'s flagship scheme for healthcare coverage.',
      status: 'Active',
      lastUpdated: '2024-03-15'
    },
    {
      id: 'S003',
      name: 'Skill India Mission',
      code: 'SIM-MSDE-2023',
      department: 'Ministry of Skill Development',
      description: 'Program to train over 40 crore people in India in different skills.',
      status: 'Draft',
      lastUpdated: '2024-03-10'
    },
    {
      id: 'S004',
      name: 'Post-Matric Scholarship',
      code: 'PMS-SJE-2024',
      department: 'Social Justice & Empowerment',
      description: 'Financial assistance to students belonging to SC/ST categories.',
      status: 'Archived',
      lastUpdated: '2023-12-05'
    }
  ];

  filteredSchemes() {
    return this.schemes.filter(s => 
      s.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onDelete(scheme: Scheme) {
    if (confirm(`Remove scheme "${scheme.name}"?`)) {
      this.schemes = this.schemes.filter(s => s.id !== scheme.id);
    }
  }
}
