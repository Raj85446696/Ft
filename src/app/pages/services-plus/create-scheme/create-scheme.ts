import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { CoreService, SchemeServiceType, SchemeItem } from '../../../services/core.service';
import { IdentityService } from '../../../services/identity.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-scheme',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-scheme.html',
  styleUrl: './create-scheme.css'
})
export class CreateScheme implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  private coreService = inject(CoreService);
  private identityService = inject(IdentityService);

  isSubmitting = false;
  isLoadingTypes = true;
  isEditMode = false;

  scheme = {
    name: '',
    typeId: '',
    schemeId: ''
  };

  schemeTypes: SchemeServiceType[] = [];

  constructor() {
    const state = history.state as { scheme?: SchemeItem };
    if (state?.scheme) {
      this.isEditMode = true;
      this.scheme.name = state.scheme.schemeName;
      this.scheme.typeId = state.scheme.typeId || state.scheme.schemeType || '';
      this.scheme.schemeId = state.scheme.schemeId;
    }
  }

  ngOnInit() {
    this.loadSchemeTypes();
  }

  loadSchemeTypes() {
    this.isLoadingTypes = true;
    this.coreService.fetchSchemeServiceTypes('1').subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          this.schemeTypes = Array.isArray(res.pd) ? res.pd : [res.pd];
        }
        this.isLoadingTypes = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingTypes = false;
          this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (!this.scheme.name.trim()) {
      Swal.fire('Validation', 'Scheme name is required', 'warning');
      return;
    }
    if (!this.scheme.typeId) {
      Swal.fire('Validation', 'Please select a scheme type', 'warning');
      return;
    }

    this.isSubmitting = true;
    const userId = this.identityService.getUserProfile()?.info?.[0]?.userId || '';

    this.coreService.createOrUpdateScheme(
      this.scheme.name.trim(),
      this.scheme.typeId,
      this.scheme.schemeId,
      userId
    ).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.rs === 'S') {
          const msg = this.isEditMode ? 'Scheme updated successfully!' : 'Scheme created successfully!';
          Swal.fire('Success', msg, 'success').then(() => {
            this.router.navigate(['/services-plus/manage-scheme']);
          });
        } else {
          Swal.fire('Error', res.rd || 'Failed to save scheme', 'error');
        }
            this.cdr.detectChanges();
      },
      error: () => {
        this.isSubmitting = false;
        Swal.fire('Error', 'Failed to save scheme', 'error');
          this.cdr.detectChanges();
      }
    });
  }
}
