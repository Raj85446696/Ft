import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import {
  IdentityService,
  FetchedRight,
  FetchedRole,
  FetchUserApp
} from '../../../services/identity.service';
import { CoreService, DepartmentItem } from '../../../services/core.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-permissions.html',
  styleUrl: './manage-permissions.css'
})
export class ManagePermissions implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  identityService = inject(IdentityService);
  coreService = inject(CoreService);

  userId = '';
  userDetails: FetchUserApp | null = null;

  allRights: FetchedRight[] = [];
  allRoles: FetchedRole[] = [];
  selectedRightIds: Set<string> = new Set();
  selectedRoleId = '';

  isLoadingUser = true;
  isLoadingRights = true;
  isLoadingRoles = true;
  isSavingRights = false;
  isAssigningRole = false;

  // ── Assign Application state ──────────────────────────────────────
  states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];

  deptTypeFilter = '';
  selectedState = '';
  allDepartments: DepartmentItem[] = [];
  isLoadingDepts = false;
  deptSearchQuery = '';
  selectedDeptId = '';
  deptRightSearch = '';
  selectedDeptRightIds: Set<string> = new Set();
  selectedDeptRoleId = '';
  isSavingDeptApp = false;

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    if (!this.userId) {
      this.router.navigate(['/user-management']);
      return;
    }
    this.loadUserDetails();
    this.loadAllRights();
    this.loadAllRoles();
    this.loadDepartments();
  }

  loadUserDetails() {
    this.isLoadingUser = true;
    this.identityService.fetchUserDetails(this.userId).subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd?.app?.length) {
          this.userDetails = res.pd.app[0];
          const rightsStr = this.userDetails.rights || '';
          if (rightsStr) {
            rightsStr.split(',').forEach(id => {
              const trimmed = id.trim();
              if (trimmed) this.selectedRightIds.add(trimmed);
            });
          }
        } else {
          Swal.fire('Error', res.rd || 'Failed to load user details', 'error');
        }
        this.isLoadingUser = false;
            this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire('Error', 'Failed to load user details', 'error');
        this.isLoadingUser = false;
          this.cdr.detectChanges();
      }
    });
  }

  loadAllRights() {
    this.isLoadingRights = true;
    this.identityService.fetchRights().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.rights) {
          this.allRights = res.rights;
        }
        this.isLoadingRights = false;
            this.cdr.detectChanges();
      },
      error: () => { this.isLoadingRights = false;
          this.cdr.detectChanges(); }
    });
  }

  loadAllRoles() {
    this.isLoadingRoles = true;
    this.identityService.fetchRoles().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.roles) {
          this.allRoles = res.roles;
        }
        this.isLoadingRoles = false;
            this.cdr.detectChanges();
      },
      error: () => { this.isLoadingRoles = false;
          this.cdr.detectChanges(); }
    });
  }

  isRightSelected(rightId: string): boolean {
    return this.selectedRightIds.has(rightId);
  }

  toggleRight(rightId: string, checked: boolean) {
    if (checked) {
      this.selectedRightIds.add(rightId);
    } else {
      this.selectedRightIds.delete(rightId);
    }
  }

  onSelectRole(roleId: string) {
    if (!roleId) return;
    const role = this.allRoles.find(r => r.roleId === roleId);
    if (role?.rights) {
      role.rights.split(',').forEach(id => {
        const trimmed = id.trim();
        if (trimmed) this.selectedRightIds.add(trimmed);
      });
    }
  }

  saveRights() {
    if (!this.userDetails?.uid) {
      Swal.fire('Error', 'User details not loaded', 'error');
      return;
    }
    const commonRights = Array.from(this.selectedRightIds).join(',');
    this.isSavingRights = true;
    this.identityService.editUserRights(this.userDetails.userId, commonRights).subscribe({
      next: (res) => {
        this.isSavingRights = false;
        if (res.rs === 'S') {
          Swal.fire('Success', 'Permissions updated successfully!', 'success');
        } else {
          Swal.fire('Error', res.rd || 'Failed to update permissions', 'error');
        }
            this.cdr.detectChanges();
      },
      error: () => {
        this.isSavingRights = false;
        Swal.fire('Error', 'Failed to update permissions', 'error');
          this.cdr.detectChanges();
      }
    });
  }

  assignRole() {
    if (!this.selectedRoleId) {
      Swal.fire('Validation', 'Please select a role to assign', 'warning');
      return;
    }
    this.isAssigningRole = true;
    this.identityService.assignRoleToUser(this.selectedRoleId, this.userId).subscribe({
      next: (res) => {
        this.isAssigningRole = false;
        if (res.rs === 'S') {
          Swal.fire('Success', 'Role assigned successfully!', 'success');
          this.selectedRoleId = '';
        } else {
          Swal.fire('Error', res.rd || 'Failed to assign role', 'error');
        }
            this.cdr.detectChanges();
      },
      error: () => {
        this.isAssigningRole = false;
        Swal.fire('Error', 'Failed to assign role', 'error');
          this.cdr.detectChanges();
      }
    });
  }

  // ── Assign Application methods ──────────────────────────────────────

  loadDepartments() {
    this.isLoadingDepts = true;
    this.coreService.fetchAllDepartments('active').subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          this.allDepartments = Array.isArray(res.pd) ? res.pd : [];
        }
        this.isLoadingDepts = false;
        this.cdr.detectChanges();
      },
      error: () => { this.isLoadingDepts = false; this.cdr.detectChanges(); }
    });
  }

  onDeptTypeChange() {
    this.selectedState = '';
    this.selectedDeptId = '';
    this.selectedDeptRightIds.clear();
    this.deptSearchQuery = '';
  }

  onStateChange() {
    this.selectedDeptId = '';
    this.selectedDeptRightIds.clear();
  }

  get filteredDepartments(): DepartmentItem[] {
    let list = this.allDepartments;
    if (this.deptTypeFilter) {
      list = list.filter(d => (d.deptType || '').toLowerCase() === this.deptTypeFilter.toLowerCase());
    }
    if (this.deptTypeFilter.toLowerCase() === 'state' && this.selectedState) {
      list = list.filter(d => (d.stateId || '').toLowerCase() === this.selectedState.toLowerCase());
    }
    if (this.deptSearchQuery.trim()) {
      const q = this.deptSearchQuery.trim().toLowerCase();
      list = list.filter(d => (d.sname || '').toLowerCase().includes(q));
    }
    return list;
  }

  get selectedDept(): DepartmentItem | undefined {
    return this.allDepartments.find(d => d.deptId === this.selectedDeptId);
  }

  selectDepartment(deptId: string) {
    this.selectedDeptId = deptId;
    this.selectedDeptRightIds.clear();
    this.deptRightSearch = '';
  }

  isDeptRightSelected(rightId: string): boolean {
    return this.selectedDeptRightIds.has(rightId);
  }

  toggleDeptRight(rightId: string, checked: boolean) {
    if (checked) {
      this.selectedDeptRightIds.add(rightId);
    } else {
      this.selectedDeptRightIds.delete(rightId);
    }
  }

  get filteredDeptRights(): FetchedRight[] {
    if (!this.deptRightSearch.trim()) return this.allRights;
    const q = this.deptRightSearch.trim().toLowerCase();
    return this.allRights.filter(r =>
      (r.displayRightName || r.rightnam || '').toLowerCase().includes(q)
    );
  }

  onDeptRoleChange(roleId: string) {
    if (!roleId) return;
    const role = this.allRoles.find(r => r.roleId === roleId);
    if (role?.rights) {
      this.selectedDeptRightIds.clear();
      role.rights.split(',').forEach(id => {
        const trimmed = id.trim();
        if (trimmed) this.selectedDeptRightIds.add(trimmed);
      });
    }
  }

  selectAllDeptRights() {
    this.filteredDeptRights.forEach(r => this.selectedDeptRightIds.add(r.rightid));
  }

  clearDeptRights() {
    this.selectedDeptRightIds.clear();
  }

  saveApplicationAssignment() {
    if (!this.selectedDeptId) {
      Swal.fire('Validation', 'Please select a department first', 'warning');
      return;
    }
    if (this.selectedDeptRightIds.size === 0) {
      Swal.fire('Validation', 'Please select at least one right for the department', 'warning');
      return;
    }
    if (!this.userDetails?.userId) {
      Swal.fire('Error', 'User details not loaded', 'error');
      return;
    }
    const rightIds = Array.from(this.selectedDeptRightIds);
    const commonRights = Array.from(this.selectedRightIds).join(',');
    this.isSavingDeptApp = true;
    this.identityService.assignAppRights(
      this.userDetails.userId, this.selectedDeptId, rightIds, commonRights
    ).subscribe({
      next: (res) => {
        this.isSavingDeptApp = false;
        if (res.rs === 'S') {
          Swal.fire('Success', 'Application rights assigned successfully!', 'success');
        } else {
          Swal.fire('Error', res.rd || 'Failed to assign application rights', 'error');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isSavingDeptApp = false;
        Swal.fire('Error', 'Failed to assign application rights', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  get rightsByCategory(): { category: string; rights: FetchedRight[] }[] {
    const map = new Map<string, FetchedRight[]>();
    this.allRights.forEach(r => {
      const cat = 'General';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(r);
    });
    return Array.from(map.entries()).map(([category, rights]) => ({ category, rights }));
  }

  get isLoading(): boolean {
    return this.isLoadingUser || this.isLoadingRights || this.isLoadingRoles;
  }
}
