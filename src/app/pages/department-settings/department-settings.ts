import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CoreService, DepartmentFaq } from '../../services/core.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-department-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './department-settings.html',
  styleUrl: './department-settings.css',
})
export class DepartmentSettings implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);

  deptId = '';
  isLoading = true;
  activeTab: 'visibility' | 'faqs' = 'visibility';

  // ── Department Info ───────────────────────────────────────────────
  deptName = '';
  deptType = '';
  deptCategory = '';

  // ── Visibility ────────────────────────────────────────────────────
  downtimeType = '';
  platformAndroid = true;
  platformIos = true;
  platformWeb = true;
  departmentVisible = true;
  isSavingVisibility = false;
  visibilityExists = false;  // track whether to POST or PUT

  // ── Services ──────────────────────────────────────────────────────
  activeServiceCount: number | null = null;

  // ── FAQs ──────────────────────────────────────────────────────────
  faqs: DepartmentFaq[] = [];
  isFaqLoading = false;
  showFaqForm = false;
  isSavingFaq = false;
  editingFaqSeq: number | null = null;

  faqForm: DepartmentFaq = {
    seqOrder: 1,
    question: '',
    answer: '',
    deptId: 0,
    lang: 'en',
    startDate: '',
    endDate: '',
    existingFileName: ''
  };

  ngOnInit() {
    this.deptId = this.route.snapshot.paramMap.get('id') || '';
    if (this.deptId) {
      this.loadDeptInfo();
      this.loadVisibility();
      this.loadFaqs();
      this.loadServiceCount();
    }
  }

  // ── Department Info ───────────────────────────────────────────────

  loadDeptInfo() {
    this.coreService.fetchDepartmentDetails(this.deptId).subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const d = Array.isArray(res.pd) ? res.pd[0] : res.pd;
          this.deptName = d.sname || '';
          this.deptType = d.deptType || '';
          this.deptCategory = d.categoryId || '';
        }
            this.cdr.detectChanges();
      },
      error: () => {
          this.cdr.detectChanges();}
    });
  }

  // ── Services ──────────────────────────────────────────────────────

  loadServiceCount() {
    this.coreService.fetchDeptServices(this.deptId).subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const all = Array.isArray(res.pd) ? res.pd : [res.pd];
          this.activeServiceCount = all.length;
        } else {
          this.activeServiceCount = 0;
        }
            this.cdr.detectChanges();
      },
      error: () => { this.activeServiceCount = 0;
          this.cdr.detectChanges(); }
    });
  }

  // ── Visibility ────────────────────────────────────────────────────

  loadVisibility() {
    this.isLoading = true;
    this.coreService.getDeptVisibility(Number(this.deptId)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.platformAndroid = res.data.platformVisibility?.android ?? true;
          this.platformIos = res.data.platformVisibility?.ios ?? true;
          this.platformWeb = res.data.platformVisibility?.web ?? true;
          this.departmentVisible = res.data.status === 'active';
          this.visibilityExists = true;
        }
        this.isLoading = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
          this.cdr.detectChanges();
      }
    });
  }

  saveVisibility() {
    this.isSavingVisibility = true;
    const payload = {
      deptSrid: Number(this.deptId),
      platformVisibility: {
        android: this.platformAndroid,
        ios: this.platformIos,
        web: this.platformWeb
      },
      status: this.departmentVisible ? 'active' : 'inactive'
    };

    const request$ = this.visibilityExists
      ? this.coreService.updateDeptVisibility(Number(this.deptId), payload)
      : this.coreService.saveDeptVisibility(payload);

    request$.subscribe({
      next: (res) => {
        this.isSavingVisibility = false;
        if (res.success) {
          this.visibilityExists = true;
          Swal.fire('Saved', 'Visibility settings saved successfully', 'success');
        } else {
          Swal.fire('Error', res.message || 'Failed to save settings', 'error');
        }
            this.cdr.detectChanges();
      },
      error: () => {
        this.isSavingVisibility = false;
        Swal.fire('Error', 'Failed to save settings', 'error');
          this.cdr.detectChanges();
      }
    });
  }

  // ── FAQs ──────────────────────────────────────────────────────────

  loadFaqs() {
    this.isFaqLoading = true;
    this.coreService.getDeptFaqs(Number(this.deptId)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.faqs = Array.isArray(res.data) ? res.data : [res.data];
        } else {
          this.faqs = [];
        }
        this.isFaqLoading = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.isFaqLoading = false;
          this.cdr.detectChanges();
      }
    });
  }

  openAddFaq() {
    this.faqForm = { seqOrder: 0, question: '', answer: '', deptId: Number(this.deptId), lang: 'en', startDate: '', endDate: '', existingFileName: '' };
    this.editingFaqSeq = null;
    this.showFaqForm = true;
  }

  openEditFaq(faq: DepartmentFaq) {
    this.faqForm = { ...faq };
    this.editingFaqSeq = faq.seqOrder;
    this.showFaqForm = true;
  }

  cancelFaqForm() {
    this.showFaqForm = false;
    this.editingFaqSeq = null;
  }

  saveFaq() {
    if (!this.faqForm.question.trim() || !this.faqForm.answer.trim()) {
      Swal.fire('Validation', 'Question and answer are required', 'warning');
      return;
    }

    this.isSavingFaq = true;
    const deptId = Number(this.deptId);
    const payload: DepartmentFaq = { ...this.faqForm, deptId };

    const request$ = this.editingFaqSeq !== null
      ? this.coreService.updateDeptFaq(deptId, this.editingFaqSeq, payload)
      : this.coreService.createDeptFaq(deptId, payload);

    request$.subscribe({
      next: (res) => {
        this.isSavingFaq = false;
        if (res.success) {
          Swal.fire('Saved', `FAQ ${this.editingFaqSeq !== null ? 'updated' : 'added'} successfully`, 'success');
          this.showFaqForm = false;
          this.editingFaqSeq = null;
          this.loadFaqs();
        } else {
          Swal.fire('Error', res.message || 'Failed to save FAQ', 'error');
        }
            this.cdr.detectChanges();
      },
      error: () => {
        this.isSavingFaq = false;
        Swal.fire('Error', 'Failed to save FAQ', 'error');
          this.cdr.detectChanges();
      }
    });
  }

  deleteFaq(faq: DepartmentFaq) {
    Swal.fire({
      title: 'Delete FAQ?',
      text: `Remove this FAQ? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.coreService.deleteDeptFaq(Number(this.deptId), faq.seqOrder).subscribe({
          next: (res) => {
            if (res.success) {
              this.faqs = this.faqs.filter(f => f.seqOrder !== faq.seqOrder);
              Swal.fire('Deleted', 'FAQ deleted successfully', 'success');
            } else {
              Swal.fire('Error', res.message || 'Failed to delete FAQ', 'error');
            }
                this.cdr.detectChanges();
          },
          error: () => {
            Swal.fire('Error', 'Failed to delete FAQ', 'error');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }
}
