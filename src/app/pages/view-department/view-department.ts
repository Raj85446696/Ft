import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CoreService } from '../../services/core.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-department',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './view-department.html',
  styleUrl: './view-department.css',
})
export class ViewDepartment implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);

  deptId = '';
  isLoading = true;

  department: any = {
    name: '',
    description: '',
    shortDescription: '',
    type: '',
    primaryCategory: '',
    secondaryCategory: '',
    keywords: '',
    languages: '',
    address: '',
    state: '',
    latitude: '',
    longitude: '',
    helpline: '',
    landphone: '',
    email: '',
    website: '',
    workingHours: '',
    workingDays: '',
    weeklyHoliday: ''
  };

  ngOnInit() {
    this.deptId = this.route.snapshot.paramMap.get('id') || '';
    if (this.deptId) {
      this.loadDepartment();
    }
  }

  loadDepartment() {
    this.isLoading = true;
    this.coreService.fetchDepartmentDetails(this.deptId).subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const d = Array.isArray(res.pd) ? res.pd[0] : res.pd;
          this.department = {
            name: d.sname || '',
            description: d.des || '',
            shortDescription: d.shortDesc || '',
            type: d.deptType || '',
            primaryCategory: d.categoryId || '',
            secondaryCategory: d.multicatid || '',
            keywords: d.searchKeyword || '',
            languages: '',
            address: d.address || '',
            state: d.stateId || '',
            latitude: d.lat || '',
            longitude: d.lon || '',
            helpline: d.contact || '',
            landphone: '',
            email: d.email || '',
            website: d.website || '',
            workingHours: d.workingHours || '',
            workingDays: '',
            weeklyHoliday: '',
            tagLine: d.tagLine || '',
            image: d.image || ''
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
}
