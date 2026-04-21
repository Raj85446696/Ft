import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { CoreService } from '../../../services/core.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class Services implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);
  private sanitizer = inject(DomSanitizer);

  deptId = '';
  searchQuery = '';
  filterCategory = '';
  filterStatus = '';
  isLoading = true;

  imgView = '/assets/f03e3621df553b3f14c17e1733a426079b8bdf08.svg';
  imgEdit = '/assets/dd968e829f828a8be9698cb9373f53984669759b.svg';

  services: any[] = [];
  filteredServices: any[] = [];

  ngOnInit() {
    this.deptId = this.route.snapshot.paramMap.get('deptId') || '';
    this.loadServices();
  }

  loadServices() {
    this.isLoading = true;
    const obs = this.deptId
      ? this.coreService.fetchDeptServices(this.deptId)
      : this.coreService.searchServices();

    obs.subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const raw = Array.isArray(res.pd) ? res.pd : [res.pd];
          this.services = raw.map((s: any) => {
            const rawStatus = (s.status || s.app || '').toLowerCase();
            return {
              id: s.serviceId || s.srid || '',
              name: s.serviceName || s.name || s.sname || '',
              category: s.categoryName || '',
              department: s.deptId || '',
              status: rawStatus === 'active' ? 'Active' : rawStatus === 'deactive' ? 'Inactive' : rawStatus,
              icon: this.formatImage(s.image || ''),
              gradient: 'linear-gradient(154.487deg, rgb(239, 246, 255) 0%, rgb(238, 242, 255) 100%)'
            };
          });
          this.applyFilters();
        }
        this.isLoading = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load services', 'error');
          this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    this.filteredServices = this.services.filter(s => {
      const matchesSearch = !this.searchQuery ||
        s.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = !this.filterCategory ||
        s.category === this.filterCategory;
      const matchesStatus = !this.filterStatus ||
        s.status === this.filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  onAddService() {
    this.router.navigate(['/service-onboard']);
  }

  onView(service: any) {
    this.router.navigate(['/view-service', service.id]);
  }

  onEdit(service: any) {
    this.router.navigate(['/edit-service', service.id]);
  }

  onToggleStatus(service: any) {
    const newStatus = service.status === 'Active' ? 'deactive' : 'active';
    this.coreService.activateDeactivateService(service.id, newStatus as any).subscribe({
      next: (res) => {
        if (res.rs === 'S') {
          service.status = newStatus === 'active' ? 'Active' : 'Inactive';
          this.applyFilters();
        } else {
          Swal.fire('Error', res.rd || 'Failed to update status', 'error');
        }
            this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire('Error', 'Failed to update status', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  onDelete(service: any) {
    Swal.fire({
      title: 'Delete Service?',
      text: `Delete "${service.name}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.coreService.deleteService(service.id).subscribe({
          next: (res) => {
            if (res.rs === 'S') {
              this.services = this.services.filter(s => s.id !== service.id);
              this.applyFilters();
              Swal.fire('Deleted', 'Service deleted successfully', 'success');
            }
                this.cdr.detectChanges();
          },
          error: () => {
            Swal.fire('Error', 'Failed to delete service', 'error');
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
