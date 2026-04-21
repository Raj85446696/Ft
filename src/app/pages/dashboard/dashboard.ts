import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { CoreService } from '../../services/core.service';
import { IdentityService } from '../../services/identity.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  sidebarService = inject(SidebarService);
  private coreService = inject(CoreService);
  private identityService = inject(IdentityService);
  private cdr = inject(ChangeDetectorRef);

  imgIcon = '/assets/1da92da122d14331d5f791763f8e60be7fdb4b6a.svg';
  imgVector = '/assets/956769bf9130543008edc016ad1ba10de14c1dd0.svg';
  imgVector4 = '/assets/ffe07c6053d0baa50339bdbee20097d7eda93422.svg';
  imgVector8 = '/assets/36bf3eeaa0310a276f299933ab2ed4c1895dbba7.svg';
  imgVector10 = '/assets/776b39a7cb2e69b6d0af50dc199d1c32b690932b.svg';
  imgVector20 = '/assets/72d1ec9bcd530716dee2a45cb6d16903bd495424.svg';

  totalUsers = 0;
  totalDepartments = 0;
  totalServices = 0;
  totalReports = 0;

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.coreService.fetchAllDepartments('active').subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const depts = Array.isArray(res.pd) ? res.pd : [res.pd];
          this.totalDepartments = depts.length;
          this.cdr.detectChanges();
        }
      },
      error: () => {
          this.cdr.detectChanges();}
    });

    this.coreService.searchServices().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const services = Array.isArray(res.pd) ? res.pd : [res.pd];
          this.totalServices = services.filter((s: any) =>
            (s.status || s.app || '').toLowerCase() === 'active'
          ).length;
          this.cdr.detectChanges();
        }
      },
      error: () => {
          this.cdr.detectChanges();}
    });

    this.identityService.fetchAllUsers()?.subscribe({
      next: (res: any) => {
        if (res.rs === 'S' && res.pd?.app) {
          this.totalUsers = Array.isArray(res.pd.app) ? res.pd.app.length : 0;
          this.cdr.detectChanges();
        }
      },
      error: () => {
          this.cdr.detectChanges();}
    });

    this.coreService.getAllReportCards().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.totalReports = Array.isArray(res.data) ? res.data.length : 0;
          this.cdr.detectChanges();
        }
      },
      error: () => {
          this.cdr.detectChanges();}
    });
  }
}
