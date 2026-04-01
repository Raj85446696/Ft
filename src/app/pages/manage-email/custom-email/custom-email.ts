import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { Navbar } from '../../../components/navbar/navbar';
import { Sidebar } from '../../../components/sidebar/sidebar';

@Component({
  selector: 'app-custom-email',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './custom-email.html',
  styleUrl: './custom-email.css'
})
export class CustomEmailPage {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  email = {
    recipientType: 'Group',
    selectedGroup: '',
    individualEmails: '',
    subject: '',
    message: '',
    attachment: null as File | null
  };

  emailGroups = ['Department Heads', 'IT Support Team', 'Finance Approvers', 'External Partners'];

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.email.attachment = event.target.files[0];
    }
  }

  onSend() {
    console.log('Sending Email:', this.email);
    alert('Official broadcast has been queued for delivery.');
    this.router.navigate(['/manage-email/view-email']);
  }

  onSaveDraft() {
    alert('Draft saved successfully.');
  }
}
