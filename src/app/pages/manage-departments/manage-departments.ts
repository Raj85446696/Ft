import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CoreService, DepartmentItem } from '../../services/core.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-departments.html',
  styleUrl: './manage-departments.css',
})
export class ManageDepartments implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  private coreService = inject(CoreService);
  private sanitizer = inject(DomSanitizer);

  imgAdd = '/assets/14facc576a05ff58abb4b7a5e45bbb08d52475bb.svg';
  imgSearch = '/assets/b4a3d47d81174acb53d72a321827549ee08d7e6a.svg';
  imgCentral = '/assets/e4a26a1a6ccdc377b342613473fab916e8a9e96f.svg';
  imgView = '/assets/f03e3621df553b3f14c17e1733a426079b8bdf08.svg';
  imgEdit = '/assets/dd968e829f828a8be9698cb9373f53984669759b.svg';
  imgActive = '/assets/982a531a90a2d1d9250126d19dd96ac4e56fe3a0.svg';
  imgInactive = '/assets/ae19ae72f4c682dee1fadc49ae8efb133e6b187d.svg';
  imgMaintenance = '/assets/60bb69d24afc5fc04443a28ab2540fe9482db029.svg';
  imgDelete = '/assets/5c584a3345c3b6f2a4e5882e3cb9ec3b3690c635.svg';

  departments: any[] = [];
  isLoading = true;

  searchTerm = '';
  filterType = '';
  filterStatus = '';

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.isLoading = true;
    this.coreService.fetchAllDepartments().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          this.departments = (Array.isArray(res.pd) ? res.pd : [res.pd]).map((d: DepartmentItem) => ({
            deptId: d.deptId,
            name: d.sname || '',
            type: d.deptType || 'Central',
            status: d.status === 'active' ? 'Active' : d.status === 'deactive' ? 'Inactive' : d.status || 'Active',
            services: 0,
            image: this.formatImage(d.image),
            des: d.des,
            shortDesc: d.shortDesc,
            categoryId: d.categoryId
          }));
          this.loadServiceCounts();
        }
        this.isLoading = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load departments', 'error');
          this.cdr.detectChanges();
      }
    });
  }

  loadServiceCounts() {
    this.coreService.fetchServices().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const services = Array.isArray(res.pd) ? res.pd : [res.pd];
          const countMap: Record<string, number> = {};
          services
            .filter((s: any) => (s.status || '').toLowerCase() === 'active')
            .forEach((s: any) => {
              const id = String(s.deptId ?? '');
              if (id) countMap[id] = (countMap[id] || 0) + 1;
            });
          this.departments = this.departments.map(d => ({
            ...d,
            services: countMap[String(d.deptId)] || 0
          }));
        }
            this.cdr.detectChanges();
      },
      error: () => {
          this.cdr.detectChanges();}
    });
  }

  get filtered() {
    return this.departments.filter(d =>
      d.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.filterType ? d.type === this.filterType : true) &&
      (this.filterStatus ? d.status === this.filterStatus : true)
    );
  }

  getStatusClass(status: string) {
    if (status === 'Active') return 'bg-[#dcfce7] text-[#008236]';
    if (status === 'Inactive') return 'bg-[#ffe2e2] text-[#c10007]';
    return 'bg-[#fef9c2] text-[#a65f00]';
  }

  toggleStatus(dept: any) {
    const newStatus = dept.status === 'Active' ? 'deactive' : 'active';
    Swal.fire({
      title: `${newStatus === 'active' ? 'Activate' : 'Deactivate'} Department?`,
      text: `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} "${dept.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#155dfc',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.coreService.activateDeactivateDept(dept.deptId, newStatus as any).subscribe({
          next: (res) => {
            if (res.rs === 'S') {
              dept.status = newStatus === 'active' ? 'Active' : 'Inactive';
              Swal.fire('Success', `Department ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'success');
            } else {
              Swal.fire('Error', res.rd || 'Operation failed', 'error');
            }
                this.cdr.detectChanges();
          },
          error: () => {
            Swal.fire('Error', 'Failed to update status', 'error');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  deleteDept(dept: any) {
    Swal.fire({
      title: 'Delete Department?',
      text: `Are you sure you want to delete "${dept.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.coreService.deleteDepartment(dept.deptId).subscribe({
          next: (res) => {
            if (res.rs === 'S') {
              this.departments = this.departments.filter(d => d.deptId !== dept.deptId);
              Swal.fire('Deleted', 'Department deleted successfully', 'success');
            } else {
              Swal.fire('Error', res.rd || 'Delete failed', 'error');
            }
                this.cdr.detectChanges();
          },
          error: () => {
            Swal.fire('Error', 'Failed to delete department', 'error');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  private formatImage(img: string): SafeUrl | string {
    if (!img) return '';
    if (img.startsWith('http') || img.startsWith('data:image') || img.startsWith('/assets/') || img.startsWith('blob:')) {
      return this.sanitizer.bypassSecurityTrustUrl(img);
    }
    // Assume raw base64 from backend
    return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${img}`);
  }
}
