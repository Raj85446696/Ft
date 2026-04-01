import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../../services/sidebar.service';
import { Navbar } from '../../../../components/navbar/navbar';
import { Sidebar } from '../../../../components/sidebar/sidebar';

@Component({
  selector: 'app-create-bi-token',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Sidebar],
  templateUrl: './create-bi-token.html',
  styleUrl: './create-bi-token.css'
})
export class CreateBiToken {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  token = {
    name: '',
    expiryDate: '',
    description: '',
    permissions: {
      read: true,
      write: false,
      delete: false
    }
  };

  onSave() {
    console.log('Saving Token:', this.token);
    // After save, navigate back
    this.router.navigate(['/app-inside/bi-token']);
  }
}
