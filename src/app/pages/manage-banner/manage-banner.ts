import { Component, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadBannerModal } from './upload-banner-modal/upload-banner-modal';

@Component({
  selector: 'app-manage-banner',
  standalone: true,
  imports: [Sidebar, Navbar, CommonModule, FormsModule, UploadBannerModal],
  templateUrl: './manage-banner.html',
  styleUrl: './manage-banner.css',
})
export class ManageBanner {
  sidebarService = inject(SidebarService);

  // Figma Assets (hashes)
  imgSt = '/assets/2005ef4ecdcef0f3570d3b71a2ab076a4983274c.png';
  imgSt1 = '/assets/bb5b8d4667b26dc4bc6f62e967291b2ff29ea3c3.png';
  imgSt2 = '/assets/8ca2ccd62932d407f807f6028a96306af694a554.png';
  imgSt3 = '/assets/75fd86b8aaca06ac9788e5355b9341ef4fc362c3.png';
  imgSt4 = '/assets/838714780ae908676bc6eaddc51743c4a6131f5d.png';
  imgSt5 = '/assets/c332278e076e1b9cf2f94739a5491e92b23a42d1.png';
  imgSt6 = '/assets/b9c3fe76f8f74a69fe8a9da566772ca42446c2ef.png';
  
  imgIcon = '/assets/3e0d164c964e16c4928433681d9f0fe26f27c82a.svg';
  imgIcon1 = '/assets/6c9614ed2999a1cebe9e868ba0b4bcc824b066ec.svg';
  imgIcon2 = '/assets/45c0d2f0393c4077f0847dfa97b26a35625b716d.svg';
  imgIcon3 = '/assets/afc39515bf84fe095c06cde6a4804fdc6dddbfa4.svg';
  
  imgVector = '/assets/38e1c9e8829c4c91e81a903bb65366f92b7beffa.svg';
  imgVector1 = '/assets/83c33eb1d449d4b6c5df5a95709e73743050bc99.svg';
  imgVector2 = '/assets/5ed912e7537c5dde183f447946430e9e6dea9b4b.svg';
  imgVector3 = '/assets/4c58a81bb13f1c44b4101e1c4628fc2312beb38d.svg';
  imgVector4 = '/assets/65bf9883ab6e6a8032be1a6e536b0717dd427732.svg';
  imgVector5 = '/assets/7b03a8c220a04720ffd8464e42e6119dda53422b.svg';
  imgVector6 = '/assets/050540a18552d07cca21794481f4114bfd8e91a2.svg';
  imgVector7 = '/assets/3888b3fc560b90fc07baa33eda8187fca9782d2b.svg';
  imgVector8 = '/assets/fad0a4ae58fbbba2885567b860be495d4745a0a3.svg';
  imgVector9 = '/assets/58d66296e9941f3e12cae6990169415aa6033f6c.svg';

  banners = [
    { title: 'Welcome to Umang Services', image: this.imgSt3, position: 'Homepage', dateRange: '1/1/2024 - 12/31/2024', clicks: '1,250', ctr: '5.51%', status: 'Active', order: 1 },
    { title: 'New Service Launch - Digital Certificates', image: this.imgSt4, position: 'Dashboard', dateRange: '2/1/2024 - 6/30/2024', clicks: '856', ctr: '2.55%', status: 'Active', order: 2 },
    { title: 'Upcoming Maintenance Notice', image: this.imgSt5, position: 'All Pages', dateRange: '3/1/2024 - 3/2/2024', clicks: '0', ctr: '6.80%', status: 'Scheduled', order: 3 },
    { title: 'Independence Day Special Offers', image: this.imgSt6, position: 'Homepage', dateRange: '8/10/2024 - 8/20/2024', clicks: '3,420', ctr: '2.41%', status: 'Active', order: 4 },
  ];

  isModalOpen = false;

  onUpload() {
    this.isModalOpen = true;
  }

  handleSave(newBanner: any) {
    if (newBanner) {
      this.banners.push({
        title: newBanner.title || 'New Banner',
        image: this.imgSt3, // Use a placeholder or the uploaded image
        position: newBanner.position,
        dateRange: `${newBanner.startDate} - ${newBanner.endDate}`,
        clicks: '0',
        ctr: '0%',
        status: 'Scheduled',
        order: this.banners.length + 1
      });
    }
    this.isModalOpen = false;
  }

  editBanner(banner: any) {
    console.log('Editing banner:', banner.title);
  }

  deleteBanner(banner: any) {
    console.log('Deleting banner:', banner.title);
  }

  toggleBannerStatus(banner: any) {
    console.log('Toggling banner status:', banner.title);
  }
}
