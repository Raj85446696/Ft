import { Component, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-departments',
  standalone: true,
  imports: [Sidebar, Navbar, CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-departments.html',
  styleUrl: './manage-departments.css',
})
export class ManageDepartments {
  sidebarService = inject(SidebarService);

  imgAdd = '/assets/14facc576a05ff58abb4b7a5e45bbb08d52475bb.svg';
  imgSearch = '/assets/b4a3d47d81174acb53d72a321827549ee08d7e6a.svg';
  imgCentral = '/assets/e4a26a1a6ccdc377b342613473fab916e8a9e96f.svg';
  imgView = '/assets/f03e3621df553b3f14c17e1733a426079b8bdf08.svg';
  imgEdit = '/assets/dd968e829f828a8be9698cb9373f53984669759b.svg';
  imgActive = '/assets/982a531a90a2d1d9250126d19dd96ac4e56fe3a0.svg';
  imgInactive = '/assets/ae19ae72f4c682dee1fadc49ae8efb133e6b187d.svg';
  imgMaintenance = '/assets/60bb69d24afc5fc04443a28ab2540fe9482db029.svg';
  imgDelete = '/assets/5c584a3345c3b6f2a4e5882e3cb9ec3b3690c635.svg';

  departments = [
    { name: 'Ministry of Health and Family Welfare', type: 'Central', status: 'Active', services: 45, statusColor: 'active' },
    { name: 'Department of Agriculture', type: 'State', status: 'Active', services: 32, statusColor: 'active' },
    { name: 'Ministry of Education', type: 'Central', status: 'Active', services: 28, statusColor: 'active' },
    { name: 'Transport Department', type: 'State', status: 'Inactive', services: 15, statusColor: 'inactive' },
    { name: 'Finance Ministry', type: 'Both', status: 'Maintenance', services: 52, statusColor: 'maintenance' },
    { name: 'Ministry of Railways', type: 'Central', status: 'Active', services: 38, statusColor: 'active' },
  ];

  searchTerm = '';
  filterType = '';
  filterStatus = '';

  get filtered() {
    return this.departments.filter(d =>
      d.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.filterType ? d.type === this.filterType : true) &&
      (this.filterStatus ? d.status === this.filterStatus : true)
    );
  }

  getStatusClass(status: string) {
    if (status === 'Active') return 'bg-[#dcfce7] text-[#008236]';
    if (status === 'Inactive') return 'bg-[#ffe2e2] text-[#c10007]';
    return 'bg-[#fef9c2] text-[#a65f00]';
  }
}
