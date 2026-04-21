import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '../../../services/sidebar.service';
import { CoreService, DepartmentReportCard, DepartmentItem } from '../../../services/core.service';

@Component({
  selector: 'app-monthly-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monthly-report.html',
  styleUrl: './monthly-report.css'
})
export class MonthlyReport implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  private coreService = inject(CoreService);

  isLoading = true;
  reportCards: DepartmentReportCard[] = [];
  departments: DepartmentItem[] = [];

  filters = {
    month: new Date().toLocaleString('en', { month: 'long' }),
    year: String(new Date().getFullYear()),
    department: ''
  };

  months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  years = ['2026', '2025', '2024', '2023', '2022'];

  ngOnInit() {
    this.loadDepartments();
    this.loadReportCards();
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

  loadReportCards() {
    this.isLoading = true;
    this.coreService.getAllReportCards().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.reportCards = Array.isArray(res.data) ? res.data : [res.data];
        } else {
          this.reportCards = [];
        }
        this.isLoading = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.reportCards = [];
        this.isLoading = false;
          this.cdr.detectChanges();
      }
    });
  }

  get filteredCards(): DepartmentReportCard[] {
    if (!this.filters.department) return this.reportCards;
    const dept = this.departments.find(d => d.sname === this.filters.department);
    if (!dept) return this.reportCards;
    return this.reportCards.filter(r => String(r.dept) === String(dept.deptId));
  }

  get totalServices(): number {
    return this.filteredCards.reduce((sum, r) => sum + (r.services || 0), 0);
  }

  get avgOverallRating(): number {
    if (!this.filteredCards.length) return 0;
    const sum = this.filteredCards.reduce((s, r) => s + (r.overallRating || 0), 0);
    return Math.round((sum / this.filteredCards.length) * 10) / 10;
  }

  get avgComplaintResolution(): number {
    if (!this.filteredCards.length) return 0;
    const sum = this.filteredCards.reduce((s, r) => s + (r.complaintResolution || 0), 0);
    return Math.round(sum / this.filteredCards.length);
  }

  getDeptName(deptId: number): string {
    const dept = this.departments.find(d => String(d.deptId) === String(deptId));
    return dept?.sname || `Dept #${deptId}`;
  }

  exportReport() {
    const rows = [
      ['Department', 'Services', 'App Rating', 'Overall Rating', 'Complaint Resolution%', 'Positive Closed', 'Negative Closed'],
      ...this.filteredCards.map(r => [
        this.getDeptName(r.dept),
        r.services,
        r.appRating,
        r.overallRating,
        r.complaintResolution,
        r.positiveClosed,
        r.negativeClosed
      ])
    ];
    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `department-report-${this.filters.month}-${this.filters.year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
