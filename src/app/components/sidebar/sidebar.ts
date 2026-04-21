import { Component, inject, signal } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { IdentityService } from '../../services/identity.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface SubItem {
  title: string;
  icon: string;
  path: string;
}

interface MenuItem {
  title: string;
  icon: string;
  path?: string;
  section?: string;
  subItems?: SubItem[];
  adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  sidebarService = inject(SidebarService);
  identityService = inject(IdentityService);
  
  // State for expanded sections
  expandedSections = signal<Set<string>>(new Set());

  toggleSection(section: string) {
    const updated = new Set(this.expandedSections());
    if (updated.has(section)) {
      updated.delete(section);
    } else {
      updated.add(section);
    }
    this.expandedSections.set(updated);
  }

  isSectionExpanded(section: string): boolean {
    return this.expandedSections().has(section);
  }

  menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: "dashboard",
      path: "/dashboard",
    },
    {
      title: "App Inside",
      icon: "inventory_2",
      section: "app-inside",
      subItems: [
        {
          title: "Manage Departments",
          icon: "list",
          path: "/manage-departments",
        },
        {
          title: "Services",
          icon: "settings",
          path: "/app-inside/services",
        },
        { title: "BI Token", icon: "shield", path: "/app-inside/bi-token" },
        {
          title: "Upload Translation",
          icon: "description",
          path: "/app-inside/upload-translation",
        },
        {
          title: "Manage Group",
          icon: "groups",
          path: "/app-inside/manage-group",
        },
      ],
    },
    {
      title: "Services Plus",
      icon: "widgets",
      section: "services-plus",
      subItems: [
        {
          title: "Onboard",
          icon: "person_add",
          path: "/service-onboard",
        },
        {
          title: "Manage Scheme",
          icon: "assignment",
          path: "/services-plus/manage-scheme",
        },
        {
          title: "Scheme Mapping",
          icon: "link",
          path: "/services-plus/scheme-mapping",
        },
      ],
    },
    {
      title: "User & Access Control",
      icon: "admin_panel_settings",
      section: "user-access",
      adminOnly: true,
      subItems: [
        {
          title: "User Management",
          icon: "group",
          path: "/user-management",
        },
        {
          title: "Role Management",
          icon: "verified_user",
          path: "/role-management",
        },
        {
          title: "Onboard Requests",
          icon: "fact_check",
          path: "/onboard-requests",
        },
      ],
    },
    {
      title: "Manage Email",
      icon: "mail",
      section: "manage-email",
      subItems: [
        {
          title: "Email Group",
          icon: "groups",
          path: "/manage-email/email-group",
        },
        {
          title: "Custom Email",
          icon: "contact_mail",
          path: "/manage-email/custom-email",
        },
        {
          title: "View Email",
          icon: "visibility",
          path: "/manage-email/view-email",
        },
      ],
    },
    {
      title: "Department Report",
      icon: "bar_chart",
      section: "dept-report",
      subItems: [
        {
          title: "Monthly",
          icon: "calendar_month",
          path: "/dept-report/monthly",
        },
        {
          title: "Yearly",
          icon: "calendar_today",
          path: "/dept-report/yearly",
        },
        {
          title: "Top Department Search",
          icon: "query_stats",
          path: "/dept-report/top-search",
        },
      ],
    },
    {
      title: "Partner Report",
      icon: "analytics",
      path: "/partner-report",
    },
    {
      title: "Service Report",
      icon: "summarize",
      path: "/service-report",
    },
    {
      title: "User Report",
      icon: "account_circle",
      path: "/user-report",
    },
    {
      title: "Manage Banner",
      icon: "image",
      path: "/manage-banner",
    },
    {
      title: "Order Management",
      icon: "shopping_cart",
      path: "/order-management",
    },
    {
      title: "Cache Refresh",
      icon: "refresh",
      path: "/cache-refresh",
    },
    {
      title: "Partner Onboarding",
      icon: "person_add_alt",
      path: "/partner-onboarding",
    },
    {
      title: "Rating & Feedback",
      icon: "star",
      path: "/rating-feedback",
    },
    {
      title: "My Account",
      icon: "account_box",
      path: "/my-account",
    },
  ];
}
