import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IdentityService } from './identity.service';

// ─── Legacy Response (MasterResponsePojo) ──────────────────────────
export interface LegacyResponse<T = any> {
  rs: string;   // S=Success, F=Failure
  rc: string;   // SLF0000=OK
  rd: string;   // Description
  pd: T;        // Payload data
}

// ─── Modern REST Response (ApiResponse) ────────────────────────────
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  errors?: string[];
}

// ─── Department Models ─────────────────────────────────────────────
export interface DepartmentItem {
  deptId: string;
  sname: string;
  des: string;
  shortDesc?: string;
  status: string;
  image: string;
  categoryId: string;
  deptType: string;
  website?: string;
  email?: string;
  contact?: string;
  address?: string;
  lat?: string;
  lon?: string;
  workingHours?: string;
  stateId?: string;
  searchKeyword?: string;
  tagLine?: string;
  multicatid?: string;
}

export interface CreateDeptRequest {
  sname: string;
  address: string;
  des: string;
  website: string;
  email: string;
  contact: string;
  workingHours: string;
  info: string;
  appUrl: string;
  lat: string;
  lon: string;
  lang: string;
  trkr: string;
  appName: string;
  webName: string;
  webUrl: string;
  iosName: string;
  iosUrl: string;
  image: string;
  multicatid: string;
  isnewupdate: string;  // "0"=Create, "1"=Update
  url: string;
  approveReject: string;
  uniqueId: string;
  shortDesc: string;
  searchKeyword: string;
  stateId: string;
  categoryId: string;
  tagLine: string;
  deptId: string;
  status: string;
  userId: string;
  deptType: string;
}

// ─── Service Models ────────────────────────────────────────────────
export interface ServiceItem {
  serviceId: string;
  sname?: string;
  serviceName?: string;
  des?: string;
  shortDesc?: string;
  status: string;
  image?: string;
  url?: string;
  deptId?: string;
  deptType?: string;
  categoryId?: string;
  searchKeyword?: string;
  tagLine?: string;
  flagnew?: string;
  popular?: string;
  trending?: string;
}

export interface SearchServicesResult {
  categoryName: string;
  categoryId: string;
  app: string;
  serviceName: string;
  serviceId: string;
  avgrating: string;
}

// ─── Group Models ──────────────────────────────────────────────────
export interface GroupItem {
  groupId: string;
  groupName: string;
  language?: string;
  status?: string;
  groupType?: string;
  image?: string;
}

export interface ServiceGroupDto {
  groupId: number;
  groupName: string;
  language: string;
  status: string;
  groupType: string;
  image: string;
  ldate: string;
  updateTime: string;
}

export interface ServiceGroupMappingDto {
  uniqueId: number;
  groupId: number;
  srid: number;
  deptSrid: number;
  orderId: number;
  status: string;
  ldate: string;
}

// ─── Visibility Models ─────────────────────────────────────────────
export interface DepartmentVisibility {
  deptSrid: number;
  platformVisibility: {
    android: boolean;
    ios: boolean;
    web: boolean;
  };
  status: string;
}

// ─── FAQ Models ────────────────────────────────────────────────────
export interface DepartmentFaq {
  seqOrder: number;
  question: string;
  answer: string;
  deptId: number;
  lang: string;
  startDate?: string;
  endDate?: string;
  existingFileName?: string;
}

// ─── Report Card Models ────────────────────────────────────────────
export interface DepartmentReportCard {
  dept: number;
  app: number;
  services: number;
  appRating: number;
  negdRating: number;
  servicesOffered: number;
  complaintResolution: number;
  negativeClosed: number;
  positiveClosed: number;
  overallRating: number;
}

// ─── Rating Models ─────────────────────────────────────────────────
export interface ServiceRating {
  srid: number;
  rating1: number;
  rating2: number;
  rating3: number;
  rating4: number;
  rating5: number;
  avg: number;
  totalRatings: number;
}

export interface UserServiceRating {
  id: number;
  srid: number;
  uid: number;
  count: number;
  previousRating: number;
  currentRating: number;
  deviceId: string;
  language: string;
  source: string;
  state: string;
  isFavorite: string;
  lastModified: string;
  comments: string;
  os: string;
  createdDate: string;
}

export interface RatingCommentsResponse {
  srid: number;
  totalComments: number;
  currentPage: number;
  totalPages: number;
  comments: UserServiceRating[];
}

// ─── Group Type Models ─────────────────────────────────────────────
export interface GroupTypeDetails {
  typeId: string;
  typeName: string;
  image: string;
  status: string;
  language: string;
}

export interface GroupTypeResponse {
  rs: string;
  rc: string;
  rd: string;
  trkr: string;
  groupTypeDetails: GroupTypeDetails[];
}

// ─── Service Keyword Models ────────────────────────────────────────
export interface ServiceKeyword {
  srid: number;
  language: string;
  alises: string;
}

// ─── Schema Models ─────────────────────────────────────────────────
export interface SchemeItem {
  id?: number;
  schemeId: string;
  schemeName: string;
  schemeType?: string;
  typeId?: string;
  status: string;
  visibility?: string;
  lang?: string;
}

export interface SchemeServiceType {
  typeId: string;
  type: string;
  typeName: string;
  status: string;
}

export interface SchemeMapping {
  schemeId: string;
  deptId: string;
  serviceId: string;
  serviceTypeId: string;
  typeId: string;
  status: string;
  orderId?: string;
  userId?: string;
  schemeName?: string;
}

export interface SchemeMappingResponse {
  schemeId: string;
  schemeName: string;
  deptId: number;
  deptName: string;
  serviceId: number;
  serviceName: string;
  serviceTypeId: number;
  serviceTypeName: string;
  schemeTypeId: number;
  schemeTypeName: string;
  orderId: number;
}

// ─── Category Models ───────────────────────────────────────────────
export interface CategoryItem {
  cgid: number;
  cgname: string;
  image?: string;
  accessUrl?: string;
  status: string;
  lang?: string;
}

// ─── Notification Models ───────────────────────────────────────────
export interface EmailRequest {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  isHtml?: boolean;
  attachments?: Record<string, string>;
  priority?: 'HIGH' | 'NORMAL' | 'LOW';
  sender?: string;
}

export interface SmsRequest {
  phoneNumber: string;
  message: string;
  templateId?: string;
  senderId?: string;
  priority?: string;
  category?: string;
  messageType?: string;
}

// ─── Payment Gateway Models ────────────────────────────────────────
export interface PaymentRequest {
  transactionId: string;
  userId: number;
  serviceId: number;
  amount: number;
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl?: string;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
}

// ─── AICTE Models ─────────────────────────────────────────────────
export interface AicteCertificateRequest {
  applicationId: string;
  studentName: string;
  courseName: string;
  instituteCode: string;
  yearOfPassing: string;
  registrationNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private http = inject(HttpClient);
  private identityService = inject(IdentityService);
  private platformId = inject(PLATFORM_ID);

  private legacyUrl = environment.coreLegacyUrl; // http://localhost:8082 (no /api/core prefix)
  private restUrl = environment.coreApiUrl;      // http://localhost:8082/api/core

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private generateTracker(): string {
    return 'TRK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  private getRestHeaders(): HttpHeaders {
    const token = this.identityService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  private legacyBody(extra: Record<string, any> = {}): Record<string, any> {
    return {
      lang: 'en',
      trkr: this.generateTracker(),
      token: this.identityService.getToken() || '',
      ...extra
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  //  DEPARTMENT MANAGEMENT (Legacy)
  // ═══════════════════════════════════════════════════════════════════

  fetchAllDepartments(status?: 'active'): Observable<LegacyResponse<DepartmentItem[]>> {
    return this.http.post<LegacyResponse<DepartmentItem[]>>(
      `${this.legacyUrl}/slfFetchAllDepartment`,
      this.legacyBody(status ? { status } : {})
    );
  }

  fetchDepartmentDetails(appid: string): Observable<LegacyResponse<DepartmentItem>> {
    return this.http.post<LegacyResponse<DepartmentItem>>(
      `${this.legacyUrl}/slfdeptdetails`,
      this.legacyBody({ appid })
    );
  }

  createDepartment(dept: Partial<CreateDeptRequest>): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfCreateAndUpdateDepartment`,
      this.legacyBody({
        ...dept,
        isnewupdate: '0',
        status: dept.status || 'active'
      })
    );
  }

  updateDepartment(dept: Partial<CreateDeptRequest>): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfCreateAndUpdateDepartment`,
      this.legacyBody({
        ...dept,
        isnewupdate: '1'
      })
    );
  }

  editAppDetails(appid: string, data: Record<string, string>): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfeditapp`,
      this.legacyBody({ appid, ...data })
    );
  }

  activateDeactivateDept(depId: string, status: 'active' | 'deactive'): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/actdeact`,
      this.legacyBody({
        type: 'application',
        app: depId,
        service: '',
        status,
        depId,
        pname: '',
        udf1: '',
        sTime: '',
        eTime: '',
        message: [],
        platform: '',
        war: ''
      })
    );
  }

  deleteDepartment(cgid: string): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/ddc`,
      this.legacyBody({ cgid })
    );
  }

  fetchMinistries(): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfministry`,
      this.legacyBody({ ministryId: '', action: 'fetch', status: 'active', app: '' })
    );
  }

  fetchDeptVisibilityLegacy(deptId: string): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/fetchDeptVisibility`,
      this.legacyBody({ deptId, type: 'application', pname: '', udf1: '', approve_reject: '', uniqueId: '' })
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SERVICE MANAGEMENT (Legacy)
  // ═══════════════════════════════════════════════════════════════════

  createOrUpdateService(data: Partial<ServiceItem> & Record<string, any>): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfCreateAndUpdateServices`,
      this.legacyBody(data)
    );
  }

  fetchServices(srid: string = ''): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slffsr`,
      this.legacyBody({ srid })
    );
  }

  fetchDeptServices(srid: string): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slffds`,
      this.legacyBody({ srid })
    );
  }

  searchServices(filters: Record<string, string> = {}): Observable<LegacyResponse<SearchServicesResult[]>> {
    return this.http.post<LegacyResponse<SearchServicesResult[]>>(
      `${this.legacyUrl}/slfsservices`,
      this.legacyBody({
        dept: '', app: '', services: '', rating: '', status: 'all',
        sdate: '', edate: '', statecentral: '',
        ...filters
      })
    );
  }

  editService(data: Record<string, string>): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfeditservices`,
      this.legacyBody(data)
    );
  }

  deleteService(serviceId: string): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfDeleteService`,
      this.legacyBody({ srid: serviceId })
    );
  }

  activateDeactivateService(serviceId: string, status: 'active' | 'deactive'): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/actdeact`,
      this.legacyBody({
        type: 'service',
        service: serviceId,
        app: '',
        status,
        pname: '',
        udf1: '',
        sTime: '',
        eTime: '',
        platform: ''
      })
    );
  }

  serviceOnOff(serviceId: string, platform: any[]): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfServiceOnOffController`,
      this.legacyBody({ serviceId, platform })
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  GROUP MANAGEMENT (Legacy)
  // ═══════════════════════════════════════════════════════════════════

  createOrUpdateGroup(groupId: string, groupName: string): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfCreateAndUpdateGroup`,
      this.legacyBody({ groupId, groupName })
    );
  }

  fetchGroupMaster(): Observable<LegacyResponse<GroupItem[]>> {
    return this.http.post<LegacyResponse<GroupItem[]>>(
      `${this.legacyUrl}/slffetchGroupMaster`,
      this.legacyBody()
    );
  }

  fetchGroupTypes(): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slffetchGroupTypes`,
      this.legacyBody()
    );
  }

  fetchDeptGroupOrder(deptId: string): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slffetchdeptgrpNmOrdrId`,
      this.legacyBody({ deptId })
    );
  }

  updateServiceGroupOrder(details: any[]): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfUpdateServiceGrpNmeOrderIdBydeptId`,
      this.legacyBody({ serviceGrpOrderDeptIdDetails: details })
    );
  }

  fetchServiceGroupOrderByDept(deptId: string, groupId: string): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slffetchSrveGrpOrdrByDeptId`,
      this.legacyBody({ deptId, groupId })
    );
  }

  fetchServiceGroupOrderDetails(deptId: string, groupId: string): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slffetchServiceGrpOrdrIdDetails`,
      this.legacyBody({ deptId, groupId })
    );
  }

  updateDeptGroupOrder(details: any[]): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfUpdateDeptGrpNmeOrderId`,
      this.legacyBody({ deptGrpNmeOrdrIdDetails: details })
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  DEPARTMENT VISIBILITY (REST)
  // ═══════════════════════════════════════════════════════════════════

  getDeptVisibility(deptSrid: number): Observable<ApiResponse<DepartmentVisibility>> {
    return this.http.get<ApiResponse<DepartmentVisibility>>(
      `${this.restUrl}/department-visibility/department/${deptSrid}`,
      { headers: this.getRestHeaders() }
    );
  }

  saveDeptVisibility(data: DepartmentVisibility): Observable<ApiResponse<DepartmentVisibility>> {
    return this.http.post<ApiResponse<DepartmentVisibility>>(
      `${this.restUrl}/department-visibility`,
      data,
      { headers: this.getRestHeaders() }
    );
  }

  updateDeptVisibility(deptSrid: number, data: DepartmentVisibility): Observable<ApiResponse<DepartmentVisibility>> {
    return this.http.put<ApiResponse<DepartmentVisibility>>(
      `${this.restUrl}/department-visibility/department/${deptSrid}`,
      data,
      { headers: this.getRestHeaders() }
    );
  }

  deleteDeptVisibility(deptSrid: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.restUrl}/department-visibility/department/${deptSrid}`,
      { headers: this.getRestHeaders() }
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  DEPARTMENT FAQS (REST)
  // ═══════════════════════════════════════════════════════════════════

  getDeptFaqs(deptId: number, lang: string = 'en'): Observable<ApiResponse<DepartmentFaq[]>> {
    return this.http.get<ApiResponse<DepartmentFaq[]>>(
      `${this.restUrl}/departments/${deptId}/faqs?lang=${lang}`,
      { headers: this.getRestHeaders() }
    );
  }

  createDeptFaq(deptId: number, faq: DepartmentFaq): Observable<ApiResponse<DepartmentFaq>> {
    return this.http.post<ApiResponse<DepartmentFaq>>(
      `${this.restUrl}/departments/${deptId}/faqs`,
      faq,
      { headers: this.getRestHeaders() }
    );
  }

  updateDeptFaq(deptId: number, seqOrder: number, faq: DepartmentFaq): Observable<ApiResponse<DepartmentFaq>> {
    return this.http.put<ApiResponse<DepartmentFaq>>(
      `${this.restUrl}/departments/${deptId}/faqs/${seqOrder}`,
      faq,
      { headers: this.getRestHeaders() }
    );
  }

  deleteDeptFaq(deptId: number, seqOrder: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.restUrl}/departments/${deptId}/faqs/${seqOrder}`,
      { headers: this.getRestHeaders() }
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  DEPARTMENT REPORT CARD (REST)
  // ═══════════════════════════════════════════════════════════════════

  getDeptReportCard(dept: number): Observable<ApiResponse<DepartmentReportCard>> {
    return this.http.get<ApiResponse<DepartmentReportCard>>(
      `${this.restUrl}/department-report-card/department/${dept}`,
      { headers: this.getRestHeaders() }
    );
  }

  getAllReportCards(): Observable<ApiResponse<DepartmentReportCard[]>> {
    return this.http.get<ApiResponse<DepartmentReportCard[]>>(
      `${this.restUrl}/department-report-card/all`,
      { headers: this.getRestHeaders() }
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SERVICE GROUPS (REST)
  // ═══════════════════════════════════════════════════════════════════

  getServiceGroupsByLang(language: string = 'en'): Observable<ApiResponse<ServiceGroupDto[]>> {
    return this.http.get<ApiResponse<ServiceGroupDto[]>>(
      `${this.restUrl}/service-groups/language/${language}`,
      { headers: this.getRestHeaders() }
    );
  }

  getServiceGroupById(groupId: number): Observable<ApiResponse<ServiceGroupDto>> {
    return this.http.get<ApiResponse<ServiceGroupDto>>(
      `${this.restUrl}/service-groups/${groupId}`,
      { headers: this.getRestHeaders() }
    );
  }

  searchServiceGroups(groupName: string = '', language: string = ''): Observable<ApiResponse<ServiceGroupDto[]>> {
    const params: string[] = [];
    if (groupName) params.push(`groupName=${encodeURIComponent(groupName)}`);
    if (language) params.push(`language=${encodeURIComponent(language)}`);
    const query = params.length > 0 ? `?${params.join('&')}` : '';
    return this.http.get<ApiResponse<ServiceGroupDto[]>>(
      `${this.restUrl}/service-groups/search${query}`,
      { headers: this.getRestHeaders() }
    );
  }

  createServiceGroup(group: Partial<ServiceGroupDto>): Observable<ApiResponse<ServiceGroupDto>> {
    return this.http.post<ApiResponse<ServiceGroupDto>>(
      `${this.restUrl}/service-groups`,
      group,
      { headers: this.getRestHeaders() }
    );
  }

  updateServiceGroup(groupId: number, group: Partial<ServiceGroupDto>): Observable<ApiResponse<ServiceGroupDto>> {
    return this.http.put<ApiResponse<ServiceGroupDto>>(
      `${this.restUrl}/service-groups/${groupId}`,
      group,
      { headers: this.getRestHeaders() }
    );
  }

  deleteServiceGroup(groupId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.restUrl}/service-groups/${groupId}`,
      { headers: this.getRestHeaders() }
    );
  }

  addServiceToGroup(mapping: Partial<ServiceGroupMappingDto>): Observable<ApiResponse<ServiceGroupMappingDto>> {
    return this.http.post<ApiResponse<ServiceGroupMappingDto>>(
      `${this.restUrl}/service-groups/mappings`,
      mapping,
      { headers: this.getRestHeaders() }
    );
  }

  getServicesInGroup(groupId: number): Observable<ApiResponse<ServiceGroupMappingDto[]>> {
    return this.http.get<ApiResponse<ServiceGroupMappingDto[]>>(
      `${this.restUrl}/service-groups/${groupId}/services`,
      { headers: this.getRestHeaders() }
    );
  }

  getGroupsByDeptService(deptSrid: number): Observable<ApiResponse<ServiceGroupDto[]>> {
    return this.http.get<ApiResponse<ServiceGroupDto[]>>(
      `${this.restUrl}/service-groups/department-service/${deptSrid}`,
      { headers: this.getRestHeaders() }
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SERVICE GROUP TYPES (REST — ws1 path)
  // ═══════════════════════════════════════════════════════════════════

  fetchGroupTypesRest(lang: string = 'en'): Observable<GroupTypeResponse> {
    return this.http.post<GroupTypeResponse>(
      `${this.restUrl}/ws1/slffetchGroupTypes`,
      { lang, trkr: this.generateTracker(), groupType: '' },
      { headers: this.getRestHeaders() }
    );
  }

  addOrUpdateGroupType(data: { groupId?: string; groupName: string; groupType?: string; image?: string; lang?: string }): Observable<any> {
    return this.http.post<any>(
      `${this.restUrl}/ws1/slfaddOrUpdateGroupType`,
      { ...data, lang: data.lang || 'en', trkr: this.generateTracker(), debug: '0' },
      { headers: this.getRestHeaders() }
    );
  }

  deleteGroupType(groupId: string): Observable<any> {
    return this.http.post<any>(
      `${this.restUrl}/ws1/slfdeleteGroupType`,
      { groupId, lang: 'en', trkr: this.generateTracker() },
      { headers: this.getRestHeaders() }
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SERVICE KEYWORDS (REST)
  // ═══════════════════════════════════════════════════════════════════

  getKeywords(srid: number, language: string = 'en'): Observable<ApiResponse<ServiceKeyword>> {
    return this.http.get<ApiResponse<ServiceKeyword>>(
      `${this.restUrl}/service-keywords/service/${srid}/language/${language}`,
      { headers: this.getRestHeaders() }
    );
  }

  getKeywordList(srid: number, language: string = 'en'): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(
      `${this.restUrl}/service-keywords/service/${srid}/language/${language}/list`,
      { headers: this.getRestHeaders() }
    );
  }

  updateKeywords(srid: number, language: string, keywords: string[]): Observable<ApiResponse<ServiceKeyword>> {
    return this.http.put<ApiResponse<ServiceKeyword>>(
      `${this.restUrl}/service-keywords/service/${srid}/language/${language}`,
      keywords,
      { headers: this.getRestHeaders() }
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  RATINGS (REST)
  // ═══════════════════════════════════════════════════════════════════

  getServiceRating(srid: number): Observable<ApiResponse<ServiceRating>> {
    return this.http.get<ApiResponse<ServiceRating>>(
      `${this.restUrl}/ratings/service/${srid}`,
      { headers: this.getRestHeaders() }
    );
  }

  getRatingComments(srid: number, page: number = 0, size: number = 20): Observable<ApiResponse<RatingCommentsResponse>> {
    return this.http.get<ApiResponse<RatingCommentsResponse>>(
      `${this.restUrl}/ratings/service/${srid}/comments?page=${page}&size=${size}`,
      { headers: this.getRestHeaders() }
    );
  }

  getAllRatings(srid: number, page: number = 0, size: number = 50): Observable<ApiResponse<UserServiceRating[]>> {
    return this.http.get<ApiResponse<UserServiceRating[]>>(
      `${this.restUrl}/ratings/service/${srid}/all?page=${page}&size=${size}`,
      { headers: this.getRestHeaders() }
    );
  }

  deleteUserRating(srid: number, uid: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.restUrl}/ratings/service/${srid}/user/${uid}`,
      { headers: this.getRestHeaders() }
    );
  }

  bulkDeleteRatings(ratingIds: number[]): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(
      `${this.restUrl}/ratings/bulk/delete`,
      ratingIds,
      { headers: this.getRestHeaders() }
    );
  }

  submitRating(data: { srid: number; uid: number; rating: number; comments?: string; deviceId?: string; language?: string; source?: string; state?: string; os?: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.restUrl}/ratings`,
      data,
      { headers: this.getRestHeaders() }
    );
  }

  getUserRating(srid: number, uid: number): Observable<ApiResponse<UserServiceRating>> {
    return this.http.get<ApiResponse<UserServiceRating>>(
      `${this.restUrl}/ratings/service/${srid}/user/${uid}`,
      { headers: this.getRestHeaders() }
    );
  }

  bulkFavoriteRatings(ratingIds: number[]): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(
      `${this.restUrl}/ratings/bulk/favorite`,
      ratingIds,
      { headers: this.getRestHeaders() }
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SERVICE KEYWORDS — ADDITIONAL (REST)
  // ═══════════════════════════════════════════════════════════════════

  addKeywords(srid: number, language: string, keywords: string[]): Observable<ApiResponse<ServiceKeyword>> {
    return this.http.post<ApiResponse<ServiceKeyword>>(
      `${this.restUrl}/service-keywords/service/${srid}/language/${language}/add`,
      keywords,
      { headers: this.getRestHeaders() }
    );
  }

  removeKeywords(srid: number, language: string, keywords: string[]): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.restUrl}/service-keywords/service/${srid}/language/${language}/remove`,
      { headers: this.getRestHeaders(), body: keywords }
    );
  }

  deleteAllKeywords(srid: number, language: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.restUrl}/service-keywords/service/${srid}/language/${language}`,
      { headers: this.getRestHeaders() }
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SERVICE GROUPS — ADDITIONAL (REST)
  // ═══════════════════════════════════════════════════════════════════

  updateServiceOrderInGroup(groupId: number, srid: number, deptSrid: number, newOrderId: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.restUrl}/service-groups/${groupId}/services/${srid}/order?deptSrid=${deptSrid}&newOrderId=${newOrderId}`,
      {},
      { headers: this.getRestHeaders() }
    );
  }

  removeServiceFromGroup(groupId: number, srid: number, deptSrid: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.restUrl}/service-groups/mappings/group/${groupId}/service/${srid}/dept/${deptSrid}`,
      { headers: this.getRestHeaders() }
    );
  }

  bulkActivateGroups(groupIds: number[]): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(
      `${this.restUrl}/service-groups/bulk/activate`,
      groupIds,
      { headers: this.getRestHeaders() }
    );
  }

  bulkDeactivateGroups(groupIds: number[]): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(
      `${this.restUrl}/service-groups/bulk/deactivate`,
      groupIds,
      { headers: this.getRestHeaders() }
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  DEPARTMENT REPORT CARD — ADDITIONAL (REST)
  // ═══════════════════════════════════════════════════════════════════

  createReportCard(data: DepartmentReportCard): Observable<ApiResponse<DepartmentReportCard>> {
    return this.http.post<ApiResponse<DepartmentReportCard>>(
      `${this.restUrl}/department-report-card`,
      data,
      { headers: this.getRestHeaders() }
    );
  }

  updateReportCard(dept: number, data: DepartmentReportCard): Observable<ApiResponse<DepartmentReportCard>> {
    return this.http.put<ApiResponse<DepartmentReportCard>>(
      `${this.restUrl}/department-report-card/department/${dept}`,
      data,
      { headers: this.getRestHeaders() }
    );
  }

  deleteReportCard(dept: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.restUrl}/department-report-card/department/${dept}`,
      { headers: this.getRestHeaders() }
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SCHEMA MANAGEMENT (Legacy)
  // ═══════════════════════════════════════════════════════════════════

  fetchSchemeList(lang: string = 'en'): Observable<LegacyResponse<SchemeItem[]>> {
    return this.http.post<LegacyResponse<SchemeItem[]>>(
      `${this.legacyUrl}/slfFetchSchemeList`,
      this.legacyBody({ lang })
    );
  }

  createOrUpdateScheme(schemeName: string, typeId: string, schemeId: string = '', userId: string = ''): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfCreateAndUpdateScheme`,
      this.legacyBody({ schemeName, schemeId, typeId, userId })
    );
  }

  deleteScheme(scheme: SchemeItem, userId: string = ''): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfDeleteScheme`,
      this.legacyBody({ id: scheme.id, userId })
    );
  }

  mapScheme(data: SchemeMapping): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfDeptServiceSchemeMapping`,
      this.legacyBody(data as any)
    );
  }

  fetchSchemeByDept(deptId: string, status: string = 'active'): Observable<LegacyResponse<SchemeMappingResponse[]>> {
    return this.http.post<LegacyResponse<SchemeMappingResponse[]>>(
      `${this.legacyUrl}/slfFetchSchemeByDeptId`,
      this.legacyBody({ deptId, status })
    );
  }

  fetchSchemeById(deptId: string, schemeId: string, status: string = 'active'): Observable<LegacyResponse<SchemeMappingResponse[]>> {
    return this.http.post<LegacyResponse<SchemeMappingResponse[]>>(
      `${this.legacyUrl}/slfFetchServiceSchemeById`,
      this.legacyBody({ deptId, schemeId, status })
    );
  }

  fetchSchemeServiceTypes(typeId: string = '0'): Observable<LegacyResponse<SchemeServiceType[]>> {
    return this.http.post<LegacyResponse<SchemeServiceType[]>>(
      `${this.legacyUrl}/slfFetchSchemeServiceType`,
      this.legacyBody({ typeId })
    );
  }

  fetchActiveDeptServices(deptId: string): Observable<LegacyResponse<ServiceItem[]>> {
    return this.http.post<LegacyResponse<ServiceItem[]>>(
      `${this.legacyUrl}/slffds`,
      this.legacyBody({ srid: deptId })
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  CATEGORY MANAGEMENT (Legacy)
  // ═══════════════════════════════════════════════════════════════════

  fetchCategories(categoryId: string = '', lang: string = 'en'): Observable<LegacyResponse<CategoryItem[]>> {
    return this.http.post<LegacyResponse<CategoryItem[]>>(
      `${this.legacyUrl}/slfFetchCategory`,
      this.legacyBody({ categoryId, lang })
    );
  }

  addCategory(data: Array<[string, string, string]>): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfAddCategory`,
      this.legacyBody({ data })
    );
  }

  fetchLinkedCategories(): Observable<LegacyResponse<CategoryItem[]>> {
    return this.http.post<LegacyResponse<CategoryItem[]>>(
      `${this.legacyUrl}/slfFetchLinkedCategory`,
      this.legacyBody()
    );
  }

  linkServiceToCategory(app: string, cgid: string): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfLinkAppCategory`,
      this.legacyBody({ app, cgid })
    );
  }

  unlinkServiceFromCategory(app: string, cgid: string): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfUnlinkAppCategory`,
      this.legacyBody({ app, cgid })
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  FAQ MANAGEMENT — LEGACY (Legacy)
  // ═══════════════════════════════════════════════════════════════════

  fetchDeptFaqLegacy(deptId: string, lang: string = 'en', faqtype: string = ''): Observable<LegacyResponse<any[]>> {
    return this.http.post<LegacyResponse<any[]>>(
      `${this.legacyUrl}/slfFetchDeptFaq`,
      this.legacyBody({ deptId, lang, faqtype })
    );
  }

  addFaq(deptId: string, question: string, answer: string, startDate: string = '', endDate: string = '', fileName: string = ''): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfLogFaq`,
      this.legacyBody({ deptId, question, answer, startDate, endDate, fileName, udf1: '', udf2: '' })
    );
  }

  updateOrDeleteFaq(deptId: string, quesNo: string, type: 'update' | 'delete', question: string = '', answer: string = '', faqtype: string = ''): Observable<LegacyResponse<any>> {
    return this.http.post<LegacyResponse<any>>(
      `${this.legacyUrl}/slfUpdateDeptFaq`,
      this.legacyBody({ deptId, quesNo, type, question, answer, faqtype })
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  NOTIFICATIONS (REST)
  // ═══════════════════════════════════════════════════════════════════

  sendEmail(data: EmailRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.restUrl}/notifications/email`,
      data,
      { headers: this.getRestHeaders() }
    );
  }

  sendTemplateEmail(data: { to: string; subject: string; templateName: string; templateVariables: Record<string, string>; priority?: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.restUrl}/notifications/email/template`,
      data,
      { headers: this.getRestHeaders() }
    );
  }

  sendSms(data: SmsRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.restUrl}/notifications/sms`,
      data,
      { headers: this.getRestHeaders() }
    );
  }

  sendOtpSms(phoneNumber: string, otp: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.restUrl}/notifications/sms/otp?phoneNumber=${encodeURIComponent(phoneNumber)}&otp=${encodeURIComponent(otp)}`,
      {},
      { headers: this.getRestHeaders() }
    );
  }

  checkSmsDeliveryStatus(messageId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.restUrl}/notifications/sms/status/${messageId}`,
      { headers: this.getRestHeaders() }
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  PAYMENT GATEWAY (REST)
  // ═══════════════════════════════════════════════════════════════════

  initiatePayment(gateway: 'paygov' | 'billdesk', data: PaymentRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.restUrl}/payment-gateway/${gateway}/initiate`,
      data,
      { headers: this.getRestHeaders() }
    );
  }

  verifyPayment(gateway: 'paygov' | 'billdesk', transactionId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.restUrl}/payment-gateway/${gateway}/verify/${transactionId}`,
      { headers: this.getRestHeaders() }
    );
  }

  initiateRefund(gateway: 'paygov' | 'billdesk', transactionId: string, amount?: number, reason?: string): Observable<ApiResponse<any>> {
    const params: string[] = [];
    if (amount !== undefined) params.push(`amount=${amount}`);
    if (reason) params.push(`reason=${encodeURIComponent(reason)}`);
    const query = params.length ? `?${params.join('&')}` : '';
    return this.http.post<ApiResponse<any>>(
      `${this.restUrl}/payment-gateway/${gateway}/refund/${transactionId}${query}`,
      {},
      { headers: this.getRestHeaders() }
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  AICTE INTEGRATION (REST)
  // ═══════════════════════════════════════════════════════════════════

  verifyCertificate(data: AicteCertificateRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.restUrl}/aicte/verify-certificate`,
      data,
      { headers: this.getRestHeaders() }
    );
  }
}
