import { Component, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [Sidebar, Navbar, CommonModule],
  templateUrl: './my-account.html',
  styleUrl: './my-account.css',
})
export class MyAccount {
  sidebarService = inject(SidebarService);

  userInfo = {
    email: 'riturajkumar@gmail.com',
    mobile: '+91 999 999 999',
    adminMobile: '+91 999 999 999',
    password: '........',
    signature: 'Digital Signature Configured',
    adminEmail: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
  };

  assignedApps = [
    'Delhi Metro',
    'Delhi Police',
    'Delhi Tourism',
    'eDhara Land Records',
    'eDistrict Delhi',
    'eHRMS',
    'eSamajKalyan',
    'eSaras',
    'Gujarat Education Department',
    'ITPO',
    'Listening Post of Lt. Governor Delhi',
    'My Ration-Gujarat',
    'OJAS',
    'Revenue Department (Gujarat)'
  ];
}
