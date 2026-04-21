import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';

interface UploadHistory {
  id: string;
  fileName: string;
  language: string;
  size: string;
  uploadedAt: string;
  status: 'Completed' | 'Processing' | 'Failed';
}

@Component({
  selector: 'app-upload-translation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './upload-translation.html',
  styleUrl: './upload-translation.css'
})
export class UploadTranslation {
  sidebarService = inject(SidebarService);
  router = inject(Router);

  selectedLanguage = 'en';
  targetLanguage = 'hi';
  isDragging = false;
  selectedFile: File | null = null;

  history: UploadHistory[] = [
    {
      id: '1',
      fileName: 'common_v1.2.json',
      language: 'Hindi',
      size: '124 KB',
      uploadedAt: '2025-03-25 14:30',
      status: 'Completed'
    },
    {
      id: '2',
      fileName: 'auth_v1.0.json',
      language: 'Bengali',
      size: '85 KB',
      uploadedAt: '2025-03-24 10:15',
      status: 'Completed'
    }
  ];

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  onUpload() {
    if (!this.selectedFile) return;

    // Simulate upload
    const nextId = (this.history.length + 1).toString();
    const newEntry: UploadHistory = {
      id: nextId,
      fileName: this.selectedFile.name,
      language: this.targetLanguage === 'hi' ? 'Hindi' : 'English',
      size: (this.selectedFile.size / 1024).toFixed(1) + ' KB',
      uploadedAt: new Date().toLocaleString(),
      status: 'Processing'
    };

    this.history = [newEntry, ...this.history];
    this.selectedFile = null;

    setTimeout(() => {
      newEntry.status = 'Completed';
    }, 2000);
  }
}
