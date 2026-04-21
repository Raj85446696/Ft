import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { CoreService } from '../../services/core.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-onboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './service-onboard.html',
  styleUrl: './service-onboard.css'
})
export class ServiceOnboard implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);

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
    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'].includes(file.type)) {
      Swal.fire('Error', 'Only PNG, JPG, JPEG, SVG formats are supported', 'error');
      input.value = '';
      return;
    }
    this.selectedFileName = file.name;
    const reader = new FileReader();
    reader.onload = () => { this.imagePreview = reader.result as string; };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.imagePreview = null;
    this.selectedFileName = '';
  }

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
    isActive: true,
    isNew: false,
    isPopular: false,
    isTrending: false
  };

  categories = ['Health', 'Education', 'Finance', 'Social Welfare', 'Agriculture', 'IT & Telecom'];
  departments: { id: string; name: string }[] = [];
  languages = ['English', 'Hindi', 'Bengali', 'Marathi', 'Gujarati', 'Tamil', 'Telugu'];

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.coreService.fetchAllDepartments().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const depts = Array.isArray(res.pd) ? res.pd : [res.pd];
          this.departments = depts.map(d => ({ id: d.deptId || (d as any).srid || '', name: d.sname || '' }));
          const preselect = this.route.snapshot.queryParamMap.get('deptId');
          if (preselect) {
            this.service.department = preselect;
          }
        }
            this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (!this.service.department) {
      Swal.fire('Validation Error', 'Please select a department.', 'warning');
      return;
    }
    if (!this.service.category) {
      Swal.fire('Validation Error', 'Please select a category.', 'warning');
      return;
    }
    this.isSubmitting = true;
    this.coreService.createOrUpdateService({
      sname: this.service.title,
      des: this.service.description,
      url: this.service.tinyUrl,
      searchKeyword: this.service.keywords,
      deptId: this.service.department,
      categoryId: this.service.category,
      status: this.service.isActive ? 'active' : 'deactive',
      flagnew: this.service.isNew ? 'yes' : 'no',
      popular: this.service.isPopular ? 'yes' : 'no',
      trending: this.service.isTrending ? 'yes' : 'no',
      image: this.imagePreview || '',
      isnewupdate: '0'
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.rs === 'S') {
          Swal.fire('Success', 'Service onboarded successfully!', 'success').then(() => {
            this.router.navigate(['/manage-departments']);
          });
        } else {
          Swal.fire('Error', res.rd || 'Failed to onboard service', 'error');
        }
            this.cdr.detectChanges();
      },
      error: () => {
        this.isSubmitting = false;
        Swal.fire('Error', 'Failed to onboard service', 'error');
          this.cdr.detectChanges();
      }
    });
  }
}
