import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-partner-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partner-onboarding.html',
  styleUrl: './partner-onboarding.css',
})
export class PartnerOnboarding {
  sidebarService = inject(SidebarService);

  // Accordion state
  existingPartnersOpen = true;
  onboardPartnerOpen = true;

  // Form Models
  existingPartner = {
    selectedPartner: '',
    name: '',
    domain: 'partner.umang.gov.in',
    email: 'email@partner.com',
    isInternational: false,
    accessToken: '',
    username: '',
    bearerToken: '',
    mobile: '',
  };

  newPartner = {
    name: '',
    email: 'email@partner.com',
    domain: 'partner.umang.gov.in',
    username: '',
    mobile: '+91 98765 43210',
    isInternational: false,
  };

  // Search
  searchTerm = '';

  // Icons from Figma Design (exact hashes)
  imgPartner = '/assets/67cc37e4b556976d43e857c2b97a39df72544123.svg';
  imgArrow = '/assets/919ca5d04ce2a7702e70806bc439b60d2cb6bfdf.svg';
  imgBuilding = '/assets/dabda5aced7ad8f7b26d30e4a091629f523d069b.svg';
  imgDomain = '/assets/e30c16cc4955fdf12b06d8b7536f1cc081b86d22.svg';
  imgEmail = '/assets/6987bf213cf22c96314610e9a50c5cbe43257511.svg';
  imgToken = '/assets/ab9fb6e5d0931bd56c29413ad4b5ee96575ba60a.svg';
  imgUser = '/assets/5207febf337317eb0f51ce7415f6aa0e143b96ff.svg';
  imgBearerToken = '/assets/1c099cf69f3ff7ac2d367b2d6ac4bc7477441cf8.svg';
  imgMobile = '/assets/e227fb18f9c1c4f1aa5e3cd3c9a2f8adff2f8c56.svg';
  imgWand = '/assets/28c0919fbe85968162461e4251d379cc7aded58c.svg';
  imgExport = '/assets/6847adaf2d3600a68ce18a848656343f3cc25782.svg';
  imgSearch = '/assets/b4a3d47d81174acb53d72a321827549ee08d7e6a.svg';

  partners = [
    {
      name: 'HealthCare Plus',
      username: 'healthcare_admin',
      domain: 'healthcare.umang.gov.in',
      email: 'contact@healthcare.com',
      mobile: '+91 98765 43210',
      isInternational: 'N',
      country: 'IN',
      status: 'Active',
      createdDate: '2024-01-15',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    {
      name: 'EduTech Solutions',
      username: 'edutech_user',
      domain: 'edutech.umang.gov.in',
      email: 'info@edutech.com',
      mobile: '+91 87654 32109',
      isInternational: 'N',
      country: 'IN',
      status: 'Active',
      createdDate: '2024-01-20',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    {
      name: 'FinServe International',
      username: 'finserve_global',
      domain: 'finserve.umang.global',
      email: 'support@finserve.com',
      mobile: '+1 555-123-4567',
      isInternational: 'Y',
      country: 'US',
      status: 'Active',
      createdDate: '2024-02-01',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    {
      name: 'Smart Transport',
      username: 'transport_admin',
      domain: 'transport.umang.gov.in',
      email: 'hello@smarttransport.com',
      mobile: '+91 76543 21098',
      isInternational: 'N',
      country: 'IN',
      status: 'Inactive',
      createdDate: '2023-12-10',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  ];

  get filteredPartners() {
    return this.partners.filter((p) =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  generateToken() {
    // Token generation endpoint to be integrated when available
  }

  saveAndGenerateToken() {
    // Save partner and generate token when endpoint is available
  }
}
