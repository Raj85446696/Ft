import { Component, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-department-settings',
  standalone: true,
  imports: [Sidebar, Navbar, CommonModule, FormsModule, RouterLink],
  templateUrl: './department-settings.html',
  styleUrl: './department-settings.css',
})
export class DepartmentSettings {
  sidebarService = inject(SidebarService);

  // Settings State Flags for toggles
  platformAndroid = true;
  platformIos = true;
  platformWeb = true;
  
  departmentVisible = true;
  downtimeType = '';
}
