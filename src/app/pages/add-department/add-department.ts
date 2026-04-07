import { Component, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [Sidebar, Navbar, CommonModule, FormsModule, RouterLink],
  templateUrl: './add-department.html',
  styleUrl: './add-department.css',
})
export class AddDepartment {
  sidebarService = inject(SidebarService);
  private router = inject(Router);

  showSuccessToast = false;

  submitForm() {
    this.showSuccessToast = true;
    setTimeout(() => {
      this.showSuccessToast = false;
      this.router.navigate(['/manage-departments']);
    }, 3000);
  }

  // Form Model
  department = {
    name: '',
    description: '',
    expected: '',
    type: '',
    primaryCategory: '',
    secondaryCategory: '',
    subCategory: '',
    languages: '',
    tagLineEn: '',
    tagLineHi: '',
    address: '',
    state: '',
    latitude: '',
    longitude: '',
    helpline: '',
    email: '',
    website: '',
    openingTime: '',
    closingTime: '',
    workingDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    }
  };
}
