import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { CoreService } from '../../../services/core.service';
import Swal from 'sweetalert2';

interface Group {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  departments: string[];
  createdAt: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-manage-group',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-group.html',
  styleUrl: './manage-group.css'
})
export class ManageGroup implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);

  deptId = '';
  searchQuery = '';
  isLoading = true;
  
  groups: Group[] = [];

  ngOnInit() {
    this.deptId = this.route.snapshot.paramMap.get('deptId') || '';
    this.loadGroups();
  }

  loadGroups() {
    this.isLoading = true;
    this.coreService.fetchGroupMaster().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const raw = Array.isArray(res.pd) ? res.pd : [res.pd];
          this.groups = raw.map((g: any) => ({
            id: g.groupId || '',
            name: g.groupName || '',
            description: g.language || '',
            membersCount: 0,
            departments: [],
            createdAt: '',
            status: (g.status === 'active' ? 'Active' : 'Inactive') as 'Active' | 'Inactive'
          }));
        }
        this.isLoading = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load groups', 'error');
          this.cdr.detectChanges();
      }
    });
  }

  get filteredGroups() {
    if (!this.searchQuery) return this.groups;
    return this.groups.filter(g =>
      g.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onDelete(group: Group) {
    Swal.fire({
      title: 'Delete Group?',
      text: `Delete "${group.name}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.coreService.deleteServiceGroup(Number(group.id)).subscribe({
          next: (res) => {
            if (res.success) {
              this.groups = this.groups.filter(g => g.id !== group.id);
              Swal.fire('Deleted', 'Group deleted successfully', 'success');
            }
                this.cdr.detectChanges();
          },
          error: () => {
            Swal.fire('Error', 'Failed to delete group', 'error');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  onToggleStatus(group: Group) {
    const prevStatus = group.status;
    group.status = group.status === 'Active' ? 'Inactive' : 'Active';
    this.coreService.updateServiceGroup(Number(group.id), {
      status: group.status === 'Active' ? 'active' : 'inactive'
    }).subscribe({
      error: () => {
        group.status = prevStatus; // revert on failure
        Swal.fire('Error', 'Failed to update group status', 'error');
            this.cdr.detectChanges();
      }
    });
  }
}
