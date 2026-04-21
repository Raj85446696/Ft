import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { CoreService, CategoryItem, DepartmentItem } from '../../services/core.service';
import { IdentityService } from '../../services/identity.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-service.html',
  styleUrl: './edit-service.css'
})
export class EditService implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);
  private identityService = inject(IdentityService);

  serviceId = '';
  isLoading = true;
  isSubmitting = false;
  imagePreview: string | null = null;
  selectedFileName = '';

  // Keywords chip management
  keywordInput = '';
  keywords: string[] = [];

  service: any = {
    department: '',
    deptId: '',
    title: '',
    shortDesc: '',
    description: '',
    serviceId: '',
    categoryId: '',
    url: '',
    status: 'active',
    flagnew: 'no',
    popular: 'no',
    trending: 'no',
    image: '',
    tagLine: '',
    stateId: '',
    deptType: 'Central'
  };

  categories: CategoryItem[] = [];
  departments: DepartmentItem[] = [];

  ngOnInit() {
    this.serviceId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCategories();
    this.loadDepartments();
    if (this.serviceId) {
      this.loadService();
    }
  }

  loadService() {
    this.isLoading = true;
    this.coreService.fetchServices(this.serviceId).subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const s = Array.isArray(res.pd) ? res.pd[0] : res.pd;
          this.service = {
            department: s.sname || '',
            deptId: s.deptId || '',
            title: s.sname || s.serviceName || '',
            shortDesc: s.shortDesc || '',
            description: s.des || '',
            serviceId: s.serviceId || s.srid || '',
            categoryId: s.categoryId || '',
            url: s.url || '',
            status: s.status || 'active',
            flagnew: s.flagnew || 'no',
            popular: s.popular || 'no',
            trending: s.trending || 'no',
            image: s.image || '',
            tagLine: s.tagLine || '',
            stateId: s.stateId || '',
            deptType: s.deptType || 'Central'
          };
          this.imagePreview = s.image || null;
          // Load search keywords separately via REST
          const srid = Number(s.serviceId || s.srid);
          if (srid) {
            this.coreService.getKeywordList(srid).subscribe({
              next: (kwRes) => {
                if (kwRes.success && kwRes.data) {
                  this.keywords = Array.isArray(kwRes.data) ? kwRes.data : [];
                }
                    this.cdr.detectChanges();
              }
            });
          }
        }
        this.isLoading = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load service', 'error');
          this.cdr.detectChanges();
      }
    });
  }

  loadCategories() {
    this.coreService.fetchCategories().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          this.categories = Array.isArray(res.pd) ? res.pd : [res.pd];
        }
            this.cdr.detectChanges();
      }
    });
  }

  loadDepartments() {
    this.coreService.fetchAllDepartments().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          this.departments = Array.isArray(res.pd) ? res.pd : [res.pd];
        }
            this.cdr.detectChanges();
      }
    });
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
    this.service.image = '';
  }

  addKeyword() {
    const kw = this.keywordInput.trim();
    if (kw && !this.keywords.includes(kw)) {
      this.keywords.push(kw);
    }
    this.keywordInput = '';
  }

  removeKeyword(kw: string) {
    this.keywords = this.keywords.filter(k => k !== kw);
  }

  onKeywordKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addKeyword();
    }
  }

  onSubmit() {
    if (!this.service.title.trim()) {
      Swal.fire('Validation', 'Service name is required', 'warning');
      return;
    }

    this.isSubmitting = true;

    this.coreService.createOrUpdateService({
      serviceId: this.serviceId,
      sname: this.service.title,
      des: this.service.description,
      shortDesc: this.service.shortDesc,
      url: this.service.url,
      image: this.imagePreview || this.service.image || '',
      searchKeyword: this.keywords.join(','),
      status: this.service.status,
      categoryId: this.service.categoryId,
      tagLine: this.service.tagLine,
      flagnew: this.service.flagnew,
      popular: this.service.popular,
      trending: this.service.trending,
      stateId: this.service.stateId,
      deptId: this.service.deptId,
      deptType: this.service.deptType,
      isnewupdate: '1'
    }).subscribe({
      next: (res) => {
        if (res.rs === 'S') {
          this.isSubmitting = false;
          Swal.fire('Success', 'Service updated successfully!', 'success').then(() => {
            this.router.navigate(['/view-service', this.serviceId]);
          });
        } else {
          this.isSubmitting = false;
          Swal.fire('Error', res.rd || 'Failed to update service', 'error');
        }
            this.cdr.detectChanges();
      },
      error: () => {
        this.isSubmitting = false;
        Swal.fire('Error', 'Failed to update service', 'error');
          this.cdr.detectChanges();
      }
    });
  }
}
