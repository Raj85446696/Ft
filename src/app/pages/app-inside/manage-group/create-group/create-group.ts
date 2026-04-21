import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SidebarService } from '../../../../services/sidebar.service';
import { CoreService } from '../../../../services/core.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-group.html',
  styleUrl: './create-group.css'
})
export class CreateGroup implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);

  deptId = '';
  isSubmitting = false;

  group = {
    name: '',
    description: '',
    departments: [] as string[],
    permissions: [] as string[]
  };

  departments: string[] = [];
  permissions = [
    { id: 'read', label: 'Read Access', description: 'Can view dashboards and reports' },
    { id: 'write', label: 'Write Access', description: 'Can edit and create records' },
    { id: 'delete', label: 'Delete Access', description: 'Can remove data permanently' },
    { id: 'admin', label: 'Admin Access', description: 'Full system configuration' }
  ];

  ngOnInit() {
    this.deptId = this.route.snapshot.paramMap.get('deptId') || '';
    this.loadDepartments();
  }

  loadDepartments() {
    this.coreService.fetchAllDepartments().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const depts = Array.isArray(res.pd) ? res.pd : [res.pd];
          this.departments = depts.map(d => d.sname || '');
        }
            this.cdr.detectChanges();
      }
    });
  }

  toggleDepartment(dept: string) {
    const index = this.group.departments.indexOf(dept);
    if (index === -1) {
      this.group.departments.push(dept);
    } else {
      this.group.departments.splice(index, 1);
    }
  }

  togglePermission(permId: string) {
    const index = this.group.permissions.indexOf(permId);
    if (index === -1) {
      this.group.permissions.push(permId);
    } else {
      this.group.permissions.splice(index, 1);
    }
  }

  onSubmit() {
    this.isSubmitting = true;
    this.coreService.createServiceGroup({
      groupName: this.group.name,
      language: 'en',
      status: 'active',
      groupType: this.group.permissions.join(',') || 'default'
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          Swal.fire('Success', 'Group created successfully!', 'success').then(() => {
            this.router.navigate(['/app-inside/manage-group', this.deptId || '0']);
          });
        } else {
          Swal.fire('Error', res.message || 'Failed to create group', 'error');
        }
            this.cdr.detectChanges();
      },
      error: () => {
        this.isSubmitting = false;
        Swal.fire('Error', 'Failed to create group', 'error');
          this.cdr.detectChanges();
      }
    });
  }
}
