import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreService } from '../../services/core.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cache-refresh',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cache-refresh.html',
  styleUrl: './cache-refresh.css',
})
export class CacheRefresh implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  private coreService = inject(CoreService);

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
  
  isLoading = true;
  cacheItems: any[] = [];
  activityLogs: any[] = [];
  autoRefreshEnabled = true;

  ngOnInit() {
    this.loadCacheData();
  }

  loadCacheData() {
    this.isLoading = true;
    let loaded = 0;
    const checkDone = () => {
      loaded++;
      if (loaded >= 3) this.isLoading = false;
    };

    this.coreService.fetchAllDepartments().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const depts = Array.isArray(res.pd) ? res.pd : [res.pd];
          this.cacheItems.push({
            name: 'Department List',
            size: `${(JSON.stringify(depts).length / 1024).toFixed(1)} KB`,
            lastUpdated: 'Just now',
            status: 'Active',
            type: 'departments'
          });
        }
        checkDone();
            this.cdr.detectChanges();
      },
      error: () => {
        checkDone();
        this.cdr.detectChanges();
      }
    });

    this.coreService.searchServices().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const services = Array.isArray(res.pd) ? res.pd : [res.pd];
          this.cacheItems.push({
            name: 'Service Catalog',
            size: `${(JSON.stringify(services).length / 1024).toFixed(1)} KB`,
            lastUpdated: 'Just now',
            status: 'Active',
            type: 'services'
          });
        }
        checkDone();
            this.cdr.detectChanges();
      },
      error: () => {
        checkDone();
        this.cdr.detectChanges();
      }
    });

    this.coreService.fetchGroupMaster().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const groups = Array.isArray(res.pd) ? res.pd : [res.pd];
          this.cacheItems.push({
            name: 'Group Master',
            size: `${(JSON.stringify(groups).length / 1024).toFixed(1)} KB`,
            lastUpdated: 'Just now',
            status: 'Active',
            type: 'groups'
          });
        }
        checkDone();
            this.cdr.detectChanges();
      },
      error: () => {
        checkDone();
        this.cdr.detectChanges();
      }
    });
  }

  refreshAll() {
    this.cacheItems = [];
    this.activityLogs.unshift({
      title: 'Full cache refresh initiated',
      detail: 'All caches',
      time: 'Just now',
      status: 'success'
    });
    this.loadCacheData();
    Swal.fire('Refreshing', 'All caches are being refreshed...', 'info');
  }

  refreshItem(item: any) {
    item.lastUpdated = 'Refreshing...';
    this.activityLogs.unshift({
      title: `Cache refreshed: ${item.name}`,
      detail: item.name,
      time: 'Just now',
      status: 'success'
    });

    if (item.type === 'departments') {
      this.coreService.fetchAllDepartments().subscribe({
        next: () => { item.lastUpdated = 'Just now';
              this.cdr.detectChanges(); }
      });
    } else if (item.type === 'services') {
      this.coreService.searchServices().subscribe({
        next: () => { item.lastUpdated = 'Just now';
              this.cdr.detectChanges(); }
      });
    } else {
      this.coreService.fetchGroupMaster().subscribe({
        next: () => { item.lastUpdated = 'Just now';
              this.cdr.detectChanges(); }
      });
    }
  }
}
