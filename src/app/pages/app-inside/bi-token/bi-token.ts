import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import Swal from 'sweetalert2';

interface BiToken {
  id: string;
  name: string;
  token: string;
  createdAt: string;
  expiryAt: string;
  status: 'Active' | 'Inactive' | 'Expired';
}

@Component({
  selector: 'app-bi-token',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bi-token.html',
  styleUrl: './bi-token.css'
})
export class BiTokenPage {
  sidebarService = inject(SidebarService);

  tokens: BiToken[] = [
    {
      id: '1',
      name: 'Development Token',
      token: 'sk_test_51...abc',
      createdAt: '2025-03-25',
      expiryAt: '2026-03-25',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Production Token',
      token: 'sk_live_51...xyz',
      createdAt: '2025-01-10',
      expiryAt: '2026-01-10',
      status: 'Active'
    }
  ];

  onRevoke(token: BiToken) {
    Swal.fire({
      title: 'Revoke Token?',
      text: `Are you sure you want to revoke "${token.name}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Revoke'
    }).then((result) => {
      if (result.isConfirmed) {
        token.status = 'Inactive';
        Swal.fire('Revoked', 'Token has been revoked successfully.', 'success');
      }
    });
  }

  onCopy(token: string) {
    navigator.clipboard.writeText(token).then(() => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Token copied to clipboard',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    }).catch(() => {
      Swal.fire('Error', 'Failed to copy token to clipboard', 'error');
    });
  }
}
