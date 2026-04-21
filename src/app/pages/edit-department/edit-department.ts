import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../../services/core.service';
import { IdentityService } from '../../services/identity.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-department',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-department.html',
  styleUrl: './edit-department.css',
})
export class EditDepartment implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private coreService = inject(CoreService);
  private identityService = inject(IdentityService);

  deptId = '';
  isLoading = true;
  isSubmitting = false;
  imagePreview: string | null = null;
  selectedFileName = '';

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

  ngOnInit() {
    this.deptId = this.route.snapshot.paramMap.get('id') || '';
    if (this.deptId) {
      this.loadDepartment();
    }
  }

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

  loadDepartment() {
    this.isLoading = true;
    this.coreService.fetchDepartmentDetails(this.deptId).subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const d = Array.isArray(res.pd) ? res.pd[0] : res.pd;

          // Parse workingHours string back into openingTime, closingTime, workingDays
          const wh = d.workingHours || '';
          const timeMatch = wh.match(/^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
          const daysMatch = wh.match(/\(([^)]+)\)/);
          const days = daysMatch ? daysMatch[1].split(',').map((s: string) => s.trim()) : [];

          this.imagePreview = d.image || null;
          this.selectedFileName = d.image ? 'Current logo' : '';

          this.department = {
            name: d.sname || '',
            description: d.des || '',
            expected: d.shortDesc || '',
            type: d.deptType || '',
            primaryCategory: d.categoryId || '',
            secondaryCategory: d.multicatid || '',
            subCategory: '',
            languages: d.searchKeyword || '',
            tagLineEn: d.tagLine || '',
            tagLineHi: '',
            address: d.address || '',
            state: d.stateId || '',
            latitude: d.lat || '',
            longitude: d.lon || '',
            helpline: d.contact || '',
            email: d.email || '',
            website: d.website || '',
            openingTime: timeMatch ? timeMatch[1] : '',
            closingTime: timeMatch ? timeMatch[2] : '',
            workingDays: {
              monday: days.includes('Monday'),
              tuesday: days.includes('Tuesday'),
              wednesday: days.includes('Wednesday'),
              thursday: days.includes('Thursday'),
              friday: days.includes('Friday'),
              saturday: days.includes('Saturday'),
              sunday: days.includes('Sunday')
            }
          };
        }
        this.isLoading = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load department details', 'error');
          this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    this.isSubmitting = true;
    const dept = this.department;
    const workingDays = Object.entries(dept.workingDays)
      .filter(([_, v]) => v)
      .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
      .join(', ');

    this.coreService.updateDepartment({
      deptId: this.deptId,
      sname: dept.name,
      des: dept.description,
      shortDesc: dept.expected,
      deptType: dept.type,
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
      status: '',
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
          Swal.fire('Success', 'Department updated successfully!', 'success').then(() => {
            this.router.navigate(['/view-department', this.deptId]);
          });
        } else {
          Swal.fire('Error', res.rd || 'Failed to update department', 'error');
        }
            this.cdr.detectChanges();
      },
      error: () => {
        this.isSubmitting = false;
        Swal.fire('Error', 'Failed to update department', 'error');
          this.cdr.detectChanges();
      }
    });
  }
}
