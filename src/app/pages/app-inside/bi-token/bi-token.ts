import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { Navbar } from '../../../components/navbar/navbar';
import { Sidebar } from '../../../components/sidebar/sidebar';

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
  imports: [CommonModule, Navbar, Sidebar, RouterLink],
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
    token.status = 'Inactive';
  }

  onCopy(token: string) {
    navigator.clipboard.writeText(token);
    alert('Token copied to clipboard!');
  }
}
