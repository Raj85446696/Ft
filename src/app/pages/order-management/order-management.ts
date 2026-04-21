import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-management.html',
  styleUrl: './order-management.css',
})
export class OrderManagement implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  private coreService = inject(CoreService);

  imgVector = '/assets/11710ca4e7873c954d84697b570f7ed2ae9d60a8.svg';
  imgVector1 = '/assets/a415eeb836d0017e90dddd03c63e9d5328589781.svg';
  imgVector2 = '/assets/161a5848b06a669e7bc863144c6518b6130f5d0c.svg';
  imgVector3 = '/assets/52f29cc97ad92babf889ac2d719b7e01f1a3a30c.svg';
  imgVector4 = '/assets/09c44a2c965d614066e3a638ce0ce14e7ba58c72.svg';
  imgVector5 = '/assets/5de9ffc3bdfb9e01240c7fcbd6601a363086b7a0.svg';
  imgVector6 = '/assets/e753c59994da735815b4da76924ad75819cbf1e0.svg';
  imgVector7 = '/assets/d3bc99cf950ec394c85737ca10fb904244fbe734.svg';
  imgIcon = '/assets/dd968e829f828a8be9698cb9373f53984669759b.svg';

  isLoading = true;
  orders: any[] = [];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.coreService.fetchGroupMaster().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const groups = Array.isArray(res.pd) ? res.pd : [res.pd];
          this.orders = groups.map((g: any, i: number) => ({
            id: `GRP-${g.groupId || (i + 1)}`,
            user: g.groupName || '',
            service: g.groupType || 'Service Group',
            amount: '',
            status: g.status === 'active' ? 'Active' : 'Inactive',
            date: g.ldate || ''
          }));
        }
        this.isLoading = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
          this.cdr.detectChanges();
      }
    });
  }

  viewDetails(order: any) {
    // Navigate to order detail when route is available
  }
}
