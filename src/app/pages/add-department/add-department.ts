import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CoreService } from '../../services/core.service';
import { IdentityService } from '../../services/identity.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-department.html',
  styleUrl: './add-department.css',
})
export class AddDepartment {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  private router = inject(Router);
  private coreService = inject(CoreService);

  private identityService = inject(IdentityService);

  isSubmitting = false;
  imagePreview: string | null = null;
  selectedFileName = '';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('Error', 'Image size must be less than 2MB', 'error');
      input.value = '';
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      Swal.fire('Error', 'Only PNG, JPG, JPEG formats are supported', 'error');
      input.value = '';
      return;
    }

    this.selectedFileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.imagePreview = null;
    this.selectedFileName = '';
  }

  submitForm() {
    this.isSubmitting = true;
    const dept = this.department;
    const workingDays = Object.entries(dept.workingDays)
      .filter(([_, v]) => v)
      .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
      .join(', ');

    this.coreService.createDepartment({
      sname: dept.name,
      des: dept.description,
      shortDesc: dept.expected,
      deptType: dept.type || 'Central',
      categoryId: dept.primaryCategory,
      multicatid: dept.secondaryCategory,
      searchKeyword: dept.languages,
      tagLine: dept.tagLineEn,
      address: dept.address,
      stateId: dept.state,
      lat: dept.latitude,
      lon: dept.longitude,
      contact: dept.helpline,
      email: dept.email,
      website: dept.website,
      workingHours: `${dept.openingTime} - ${dept.closingTime}` + (workingDays ? ` (${workingDays})` : ''),
      image: this.imagePreview || '',
      info: '',
      appUrl: '',
      appName: '',
      webName: '',
      webUrl: '',
      iosName: '',
      iosUrl: '',
      url: '',
      approveReject: '',
      uniqueId: '',
      userId: this.identityService.getUserProfile()?.info?.[0]?.userId || '',
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.rs === 'S') {
          Swal.fire('Success', 'Department created successfully!', 'success').then(() => {
            this.router.navigate(['/manage-departments']);
          });
        } else {
          Swal.fire('Error', res.rd || 'Failed to create department', 'error');
        }
            this.cdr.detectChanges();
      },
      error: () => {
        this.isSubmitting = false;
        Swal.fire('Error', 'Failed to create department', 'error');
          this.cdr.detectChanges();
      }
    });
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
