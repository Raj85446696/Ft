import { Component, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Sidebar, Navbar, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  sidebarService = inject(SidebarService);

  // Stats card icons
  imgIcon = '/assets/1da92da122d14331d5f791763f8e60be7fdb4b6a.svg';
  imgVector = '/assets/956769bf9130543008edc016ad1ba10de14c1dd0.svg';
  imgVector4 = '/assets/ffe07c6053d0baa50339bdbee20097d7eda93422.svg';
  imgVector8 = '/assets/36bf3eeaa0310a276f299933ab2ed4c1895dbba7.svg';
  imgVector10 = '/assets/776b39a7cb2e69b6d0af50dc199d1c32b690932b.svg';
  imgVector20 = '/assets/72d1ec9bcd530716dee2a45cb6d16903bd495424.svg';
}
