import { Component, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cache-refresh',
  standalone: true,
  imports: [Sidebar, Navbar, CommonModule, FormsModule],
  templateUrl: './cache-refresh.html',
  styleUrl: './cache-refresh.css',
})
export class CacheRefresh {
  sidebarService = inject(SidebarService);

  // Figma Assets (Exact hashes for download script)
  imgIcon = '/assets/493b91390cbe26d016e66da5a1c97145aaa260b0.svg';
  imgVector = '/assets/beab7bbbb9398ee79b88edfea78cb6072c016750.svg';
  imgVector1 = '/assets/89436c7579531b7eb93fe636f1452372ee443255.svg';
  imgVector2 = '/assets/5187fd40298a14d2cdb828625b3acae6c16b27a6.svg';
  imgVector3 = '/assets/79521d0145eec9ac97f42ed321e5551166ac0f7f.svg';
  imgVector4 = '/assets/d5aa4325b0eaf701000a1209efd13d5cedd97b1c.svg';
  imgVector5 = '/assets/09c44a2c965d614066e3a638ce0ce14e7ba58c72.svg';
  imgVector6 = '/assets/5de9ffc3bdfb9e01240c7fcbd6601a363086b7a0.svg';
  imgVector7 = '/assets/2e17e5a823814dc073c8edc64106cc50f389f329.svg';
  imgVector8 = '/assets/b35157f36754a304f44a2cb650e8d6a0cffd2886.svg';
  imgVector9 = '/assets/9d165a0411299930cd8c464a23f90d20152e0361.svg';
  imgVector10 = '/assets/4446d0dfe8bb88d26aeb0a6d8133a0e2965b6966.svg';
  imgIcon1 = '/assets/1254bc9a582fe13052f049ca20e01f67bbd26d54.svg';
  imgIcon2 = '/assets/75303fe52bf85cbe84724d08843dc9213202c34f.svg';
  imgIcon3 = '/assets/cf868b674af7544326f7b1b6ac0ba9a2f1737fca.svg';
  imgIcon4 = '/assets/8202787d99dde4ed1a32fe4a4cecaa739b4c4f99.svg';
  imgIcon5 = '/assets/31ea5593b49963ae7838c851bacf460afb975dd5.svg';
  
  // Cache Management Data
  cacheItems = [
    { name: 'Department List', size: '2.4 MB', lastUpdated: '5 mins ago', status: 'Active' },
    { name: 'Service Catalog', size: '8.1 MB', lastUpdated: '12 mins ago', status: 'Active' },
    { name: 'User Sessions', size: '15.6 MB', lastUpdated: '3 mins ago', status: 'Active' },
    { name: 'API Tokens', size: '512 KB', lastUpdated: '45 mins ago', status: 'Stale' },
    { name: 'Translation Files', size: '4.2 MB', lastUpdated: '2 hours ago', status: 'Stale' },
  ];

  // Activity Log
  activityLogs = [
    { title: 'Cache refreshed successfully', detail: 'Service Catalog', time: '12 mins ago', status: 'success' },
    { title: 'Auto refresh completed', detail: 'Department List', time: '5 mins ago', status: 'completed' },
  ];

  autoRefreshEnabled = true;

  refreshAll() {
    console.log('Refreshing all cache...');
  }

  refreshItem(item: any) {
    console.log(`Refreshing ${item.name}...`);
  }
}
