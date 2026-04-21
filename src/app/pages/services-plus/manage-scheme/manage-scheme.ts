import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { CoreService, SchemeItem } from '../../../services/core.service';
import { IdentityService } from '../../../services/identity.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-scheme',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-scheme.html',
  styleUrl: './manage-scheme.css'
})
export class ManageScheme implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  private coreService = inject(CoreService);
  private identityService = inject(IdentityService);

  searchQuery = '';
  isLoading = true;
  schemes: SchemeItem[] = [];

  ngOnInit() {
    this.loadSchemes();
  }

  loadSchemes() {
    this.isLoading = true;
    this.coreService.fetchSchemeList().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          this.schemes = Array.isArray(res.pd) ? res.pd : [res.pd];
        } else {
          this.schemes = [];
        }
        this.isLoading = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load schemes', 'error');
          this.cdr.detectChanges();
      }
    });
  }

  filteredSchemes() {
    const q = this.searchQuery.toLowerCase();
    if (!q) return this.schemes;
    return this.schemes.filter(s =>
      (s.schemeName || '').toLowerCase().includes(q) ||
      (s.schemeId || '').toLowerCase().includes(q)
    );
  }

  getStatusClass(status: string): string {
    if (status === 'active') return 'bg-[#dcfce7] text-[#008236]';
    if (status === 'deactive') return 'bg-[#ffe2e2] text-[#c10007]';
    return 'bg-[#fef9c2] text-[#a65f00]';
  }

  getStatusLabel(status: string): string {
    if (status === 'active') return 'Active';
    if (status === 'deactive') return 'Inactive';
    return status || 'Unknown';
  }

  get activeCount(): number {
    return this.schemes.filter(s => s.status === 'active').length;
  }

  get inactiveCount(): number {
    return this.schemes.filter(s => s.status !== 'active').length;
  }

  onEdit(scheme: SchemeItem) {
    this.router.navigate(['/services-plus/create-scheme'], { state: { scheme } });
  }

  onDelete(scheme: SchemeItem) {
    Swal.fire({
      title: 'Delete Scheme?',
      text: `Remove "${scheme.schemeName}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        const userId = this.identityService.getUserProfile()?.info?.[0]?.userId || '';
        this.coreService.deleteScheme(scheme, userId).subscribe({
          next: (res) => {
            if (res.rs === 'S') {
              Swal.fire('Done', 'Scheme removed successfully', 'success');
              this.loadSchemes();
            } else {
              Swal.fire('Error', res.rd || 'Failed to remove scheme', 'error');
            }
                this.cdr.detectChanges();
          },
          error: () => {
            Swal.fire('Error', 'Failed to remove scheme', 'error');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }
}
