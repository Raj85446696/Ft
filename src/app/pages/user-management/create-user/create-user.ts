import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { Navbar } from '../../../components/navbar/navbar';
import { Sidebar } from '../../../components/sidebar/sidebar';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Sidebar],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css'
})
export class CreateUser {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  user = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    gender: 'Male',
    jobTitle: '',
    role: 'User',
    department: '',
    password: '',
    confirmPassword: '',
    groups: [] as string[]
  };

  genders = ['Male', 'Female', 'Other'];
  roles = ['Admin', 'Manager', 'User', 'Guest'];
  departments = ['IT & Telecom', 'Finance', 'Health', 'Education', 'Operations', 'Social Welfare'];
  availableGroups = ['Standard Support', 'Department Heads', 'External Auditors', 'Media Team'];

  toggleGroup(group: string) {
    const index = this.user.groups.indexOf(group);
    if (index === -1) {
      this.user.groups.push(group);
    } else {
      this.user.groups.splice(index, 1);
    }
  }

  onSubmit() {
    console.log('User Created:', this.user);
    this.router.navigate(['/user-management']);
  }
}
