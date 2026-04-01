import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-banner-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-banner-modal.html',
  styleUrl: './upload-banner-modal.css',
})
export class UploadBannerModal {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  formData = {
    title: '',
    url: '',
    position: 'Homepage',
    startDate: '',
    endDate: '',
  };

  imgIcon = '/assets/3e0d164c964e16c4928433681d9f0fe26f27c82a.svg'; // Upload icon
  imgVector = '/assets/38e1c9e8829c4c91e81a903bb65366f92b7beffa.svg'; // Close/X icon
  imgIcon1 = '/assets/6c9614ed2999a1cebe9e868ba0b4bcc824b066ec.svg'; // Upload image icon
  imgIcon2 = '/assets/dd968e829f828a8be9698cb9373f53984669759b.svg'; // Placeholder icon if needed

  onClose() {
    this.close.emit();
  }

  onSave() {
    console.log('Saving banner:', this.formData);
    this.save.emit(this.formData);
    this.onClose();
  }
}
