import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import {
  CoreService, DepartmentItem, SchemeItem,
  SchemeServiceType, SchemeMappingResponse, ServiceItem
} from '../../../services/core.service';
import { IdentityService } from '../../../services/identity.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scheme-mapping',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './scheme-mapping.html',
  styleUrl: './scheme-mapping.css'
})
export class SchemeMapping implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  private coreService = inject(CoreService);
  private identityService = inject(IdentityService);

  isLoadingDepts = true;
  isLoadingMappings = false;
  isLoadingTypes = true;
  isLoadingSchemes = true;
  isSubmitting = false;
  showForm = false;

  departments: DepartmentItem[] = [];
  schemes: SchemeItem[] = [];
  deptServices: ServiceItem[] = [];
  isLoadingDeptServices = false;
  serviceTypes: SchemeServiceType[] = [];
  schemeTypes: SchemeServiceType[] = [];
  mappings: SchemeMappingResponse[] = [];

  selectedDeptId = '';

  form = {
    schemeId: '',
    serviceId: '',
    serviceTypeId: '',
    typeId: '',
    status: 'active',
    orderId: '1'
  };

  constructor() {
    const state = history.state as { schemeId?: string; schemeName?: string };
    if (state?.schemeId) {
      this.form.schemeId = state.schemeId;
    }
  }

  ngOnInit() {
    this.loadDepartments();
    this.loadSchemes();
    this.loadTypes();
  }

  loadDepartments() {
    this.isLoadingDepts = true;
    this.coreService.fetchAllDepartments().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const all = Array.isArray(res.pd) ? res.pd : [res.pd];
          this.departments = all.filter(d => d.status === 'active');
        }
        this.isLoadingDepts = false;
            this.cdr.detectChanges();
      },
      error: () => { this.isLoadingDepts = false;
          this.cdr.detectChanges(); }
    });
  }

  loadSchemes() {
    this.isLoadingSchemes = true;
    this.coreService.fetchSchemeList().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const all = Array.isArray(res.pd) ? res.pd : [res.pd];
          this.schemes = all.filter(s => s.schemeId);
        }
        this.isLoadingSchemes = false;
            this.cdr.detectChanges();
      },
      error: () => { this.isLoadingSchemes = false;
          this.cdr.detectChanges(); }
    });
  }

  loadTypes() {
    this.isLoadingTypes = true;
    this.coreService.fetchSchemeServiceTypes('0').subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          this.serviceTypes = Array.isArray(res.pd) ? res.pd : [res.pd];
        }
            this.cdr.detectChanges();
      },
      error: () => {
          this.cdr.detectChanges();}
    });
    this.coreService.fetchSchemeServiceTypes('1').subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          this.schemeTypes = Array.isArray(res.pd) ? res.pd : [res.pd];
        }
        this.isLoadingTypes = false;
            this.cdr.detectChanges();
      },
      error: () => { this.isLoadingTypes = false;
          this.cdr.detectChanges(); }
    });
  }

  onDeptChange() {
    this.deptServices = [];
    this.form.serviceTypeId = '';
    if (!this.selectedDeptId) {
      this.mappings = [];
      return;
    }
    this.loadMappings();
    this.loadDeptServices();
  }

  loadDeptServices() {
    this.isLoadingDeptServices = true;
    this.coreService.fetchActiveDeptServices(this.selectedDeptId).subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const all: any[] = Array.isArray(res.pd) ? res.pd : [res.pd];
          this.deptServices = all.map(s => ({
            serviceId: s.srid ?? s.serviceId,
            serviceName: s.name ?? s.serviceName ?? s.sname,
            sname: s.name ?? s.sname ?? s.serviceName,
            status: s.status ?? 'active'
          } as ServiceItem));
        }
        this.isLoadingDeptServices = false;
            this.cdr.detectChanges();
      },
      error: () => { this.isLoadingDeptServices = false;
          this.cdr.detectChanges(); }
    });
  }

  loadMappings() {
    this.isLoadingMappings = true;
    this.coreService.fetchSchemeByDept(this.selectedDeptId).subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          this.mappings = Array.isArray(res.pd) ? res.pd : [res.pd];
        } else {
          this.mappings = [];
        }
        this.isLoadingMappings = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingMappings = false;
        Swal.fire('Error', 'Failed to load scheme mappings', 'error');
          this.cdr.detectChanges();
      }
    });
  }

  onAddMapping() {
    this.form = { schemeId: this.form.schemeId, serviceId: '', serviceTypeId: '', typeId: '', status: 'active', orderId: '1' };
    this.showForm = true;
  }

  onCancelForm() {
    this.showForm = false;
  }

  onSubmitMapping() {
    if (!this.selectedDeptId) {
      Swal.fire('Validation', 'Please select a department', 'warning');
      return;
    }
    if (!this.form.schemeId) {
      Swal.fire('Validation', 'Please select a scheme', 'warning');
      return;
    }
    if (!this.form.serviceId.trim()) {
      Swal.fire('Validation', 'Service ID is required', 'warning');
      return;
    }
    if (!this.form.serviceTypeId) {
      Swal.fire('Validation', 'Please select a service', 'warning');
      return;
    }
    if (!this.form.typeId) {
      Swal.fire('Validation', 'Please select a scheme type', 'warning');
      return;
    }

    this.isSubmitting = true;
    const userId = this.identityService.getUserProfile()?.info?.[0]?.userId || '';

    this.coreService.mapScheme({
      schemeId: this.form.schemeId,
      deptId: this.selectedDeptId,
      serviceId: this.form.serviceId.trim(),
      serviceTypeId: this.form.serviceTypeId,
      typeId: this.form.typeId,
      status: this.form.status,
      orderId: this.form.orderId,
      userId
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.rs === 'S') {
          Swal.fire('Success', 'Scheme mapped successfully!', 'success');
          this.showForm = false;
          this.loadMappings();
        } else {
          Swal.fire('Error', res.rd || 'Failed to map scheme', 'error');
        }
            this.cdr.detectChanges();
      },
      error: () => {
        this.isSubmitting = false;
        Swal.fire('Error', 'Failed to map scheme', 'error');
          this.cdr.detectChanges();
      }
    });
  }

  getDeptName(deptId: string): string {
    return this.departments.find(d => d.deptId === deptId)?.sname || deptId;
  }
}
