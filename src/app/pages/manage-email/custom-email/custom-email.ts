import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { CoreService } from '../../../services/core.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-custom-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-email.html',
  styleUrl: './custom-email.css'
})
export class CustomEmailPage {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  private coreService = inject(CoreService);

  isSending = false;

  email = {
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    isHtml: true,
    priority: 'NORMAL' as 'HIGH' | 'NORMAL' | 'LOW'
  };

  priorities = ['HIGH', 'NORMAL', 'LOW'];

  onSend() {
    if (!this.email.to.trim()) {
      Swal.fire('Validation', 'Recipient email is required', 'warning');
      return;
    }
    if (!this.email.subject.trim()) {
      Swal.fire('Validation', 'Subject is required', 'warning');
      return;
    }
    if (!this.email.body.trim()) {
      Swal.fire('Validation', 'Message body is required', 'warning');
      return;
    }

    this.isSending = true;
    this.coreService.sendEmail({
      to: this.email.to.trim(),
      cc: this.email.cc.trim() || undefined,
      bcc: this.email.bcc.trim() || undefined,
      subject: this.email.subject.trim(),
      body: this.email.body.trim(),
      isHtml: this.email.isHtml,
      priority: this.email.priority
    }).subscribe({
      next: (res) => {
        this.isSending = false;
        if (res.success) {
          Swal.fire('Sent', 'Email has been queued for delivery.', 'success').then(() => {
            this.router.navigate(['/manage-email/view-email']);
          });
        } else {
          Swal.fire('Error', res.message || 'Failed to send email', 'error');
        }
            this.cdr.detectChanges();
      },
      error: () => {
        this.isSending = false;
        Swal.fire('Error', 'Failed to send email. Please try again.', 'error');
          this.cdr.detectChanges();
      }
    });
  }

  onSaveDraft() {
    Swal.fire('Info', 'Draft saving is not supported by the current API.', 'info');
  }
}
