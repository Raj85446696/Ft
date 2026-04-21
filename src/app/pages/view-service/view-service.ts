import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { CoreService } from '../../services/core.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-service',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-service.html',
  styleUrl: './view-service.css'
})
export class ViewService implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);

  serviceId = '';
  isLoading = true;

  service: any = null;

  get keywordList(): string[] {
    if (!this.service?.keywords) return [];
    return this.service.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);
  }

  ngOnInit() {
    this.serviceId = this.route.snapshot.paramMap.get('id') || '';
    if (this.serviceId) {
      this.loadService();
    } else {
      this.isLoading = false;
    }
  }

  loadService() {
    this.isLoading = true;
    this.coreService.fetchServices(this.serviceId).subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const s: any = Array.isArray(res.pd) ? res.pd[0] : res.pd;
          this.service = {
            department: s.deptId || '',
            title: s.sname || s.serviceName || '',
            description: s.des || s.shortDesc || '',
            serviceId: s.serviceId || s.srid || '',
            ownerCode: s.ownerCode || '',
            category: s.categoryName || s.categoryId || s.serviceType || '',
            keywords: s.searchKeyword || s.keywords || '',
            contact: s.contact || '',
            website: s.website || '',
            email: s.contactEmail || '',
            faq: s.faq || '',
            tinyUrl: s.tinyUrl || s.url || '',
            secretKey: s.secretKey || '',
            language: s.language || s.lang || '',
            redirectApi: s.redirectApi || '',
            instanceId: s.instanceId || '',
            dynamicPath: s.dynamicPath || '',
            versionCode: s.versionCode || '',
            isActive: (s.status || '').toLowerCase() === 'active',
            image: s.image || '',
            shortDesc: s.shortDesc || '',
            deptType: s.deptType || '',
            flagnew: s.flagnew || 'no',
            popular: s.popular || 'no',
            trending: s.trending || 'no'
          };
        } else {
          Swal.fire('Not Found', 'Service details not found', 'warning');
        }
        this.isLoading = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load service details', 'error');
          this.cdr.detectChanges();
      }
    });
  }
}
