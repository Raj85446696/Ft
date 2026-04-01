import { Component, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [Sidebar, Navbar, CommonModule, FormsModule],
  templateUrl: './order-management.html',
  styleUrl: './order-management.css',
})
export class OrderManagement {
  sidebarService = inject(SidebarService);

  // Figma Icons from context (hashes)
  imgVector = '/assets/11710ca4e7873c954d84697b570f7ed2ae9d60a8.svg';
  imgVector1 = '/assets/a415eeb836d0017e90dddd03c63e9d5328589781.svg';
  imgVector2 = '/assets/161a5848b06a669e7bc863144c6518b6130f5d0c.svg';
  imgVector3 = '/assets/52f29cc97ad92babf889ac2d719b7e01f1a3a30c.svg';
  imgVector4 = '/assets/09c44a2c965d614066e3a638ce0ce14e7ba58c72.svg';
  imgVector5 = '/assets/5de9ffc3bdfb9e01240c7fcbd6601a363086b7a0.svg';
  imgVector6 = '/assets/e753c59994da735815b4da76924ad75819cbf1e0.svg';
  imgVector7 = '/assets/d3bc99cf950ec394c85737ca10fb904244fbe734.svg';
  imgIcon = '/assets/dd968e829f828a8be9698cb9373f53984669759b.svg';

  orders = [
    { id: 'ORD-1001', user: 'Rahul Sharma', service: 'Certificate', amount: '₹100', status: 'Completed', date: '2024-02-10' },
    { id: 'ORD-1002', user: 'Priya Patel', service: 'License Application', amount: '₹500', status: 'Processing', date: '2024-02-12' },
    { id: 'ORD-1003', user: 'Amit Kumar', service: 'Document Verification', amount: '₹250', status: 'Pending', date: '2024-02-13' },
    { id: 'ORD-1004', user: 'Sneha Reddy', service: 'Registration', amount: '₹300', status: 'Completed', date: '2024-02-11' },
    { id: 'ORD-1005', user: 'Vikram Singh', service: 'Certificate', amount: '₹100', status: 'Failed', date: '2024-02-09' },
  ];

  viewDetails(order: any) {
    console.log('Viewing details for:', order.id);
  }
}
