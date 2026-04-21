import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { Login } from './pages/login/login';
import { Onboard } from './pages/onboard/onboard';
import { Dashboard } from './pages/dashboard/dashboard';
import { ManageDepartments } from './pages/manage-departments/manage-departments';
import { AddDepartment } from './pages/add-department/add-department';
import { ViewDepartment } from './pages/view-department/view-department';
import { EditDepartment } from './pages/edit-department/edit-department';
import { DepartmentSettings } from './pages/department-settings/department-settings';
import { MyAccount } from './pages/my-account/my-account';
import { RatingFeedback } from './pages/rating-feedback/rating-feedback';
import { PartnerOnboarding } from './pages/partner-onboarding/partner-onboarding';
import { CacheRefresh } from './pages/cache-refresh/cache-refresh';
import { OrderManagement } from './pages/order-management/order-management';
import { ManageBanner } from './pages/manage-banner/manage-banner';
import { UserReport } from './pages/user-report/user-report';
import { ServiceReport } from './pages/service-report/service-report';
import { PartnerReport } from './pages/partner-report/partner-report';
import { MonthlyReport } from './pages/department-report/monthly/monthly-report';
import { YearlyReport } from './pages/department-report/yearly/yearly-report';
import { TopDepartmentSearch } from './pages/department-report/top-search/top-department-search';
import { Services } from './pages/app-inside/services/services';
import { BiTokenPage } from './pages/app-inside/bi-token/bi-token';
import { CreateBiToken } from './pages/app-inside/bi-token/create-bi-token/create-bi-token';
import { UploadTranslation } from './pages/app-inside/upload-translation/upload-translation';
import { ManageGroup } from './pages/app-inside/manage-group/manage-group';
import { CreateGroup } from './pages/app-inside/manage-group/create-group/create-group';
import { ServiceOnboard } from './pages/service-onboard/service-onboard';
import { ManageScheme } from './pages/services-plus/manage-scheme/manage-scheme';
import { CreateScheme } from './pages/services-plus/create-scheme/create-scheme';
import { SchemeMapping } from './pages/services-plus/scheme-mapping/scheme-mapping';
import { UserManagement } from './pages/user-management/user-management';
import { CreateUser } from './pages/user-management/create-user/create-user';
import { ManagePermissions } from './pages/user-management/manage-permissions/manage-permissions';
import { RoleManagement } from './pages/role-management/role-management';
import { PermissionsPage } from './pages/permissions/permissions';
import { OnboardRequests } from './pages/onboard-requests/onboard-requests';
import { EmailGroupPage } from './pages/manage-email/email-group/email-group';
import { ViewEmailPage } from './pages/manage-email/view-email/view-email';
import { CustomEmailPage } from './pages/manage-email/custom-email/custom-email';
import { ViewService } from './pages/view-service/view-service';
import { EditService } from './pages/edit-service/edit-service';

export const routes: Routes = [
  // Public routes
  { path: 'login', component: Login },
  { path: 'onboard', component: Onboard },
  
  // Protected routes - require authentication
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'manage-departments', component: ManageDepartments, canActivate: [authGuard] },
  { path: 'add-department', component: AddDepartment, canActivate: [authGuard] },
  { path: 'view-department/:id', component: ViewDepartment, canActivate: [authGuard] },
  { path: 'edit-department/:id', component: EditDepartment, canActivate: [authGuard] },
  { path: 'department-settings/:id', component: DepartmentSettings, canActivate: [authGuard] },
  { path: 'my-account', component: MyAccount, canActivate: [authGuard] },
  { path: 'rating-feedback', component: RatingFeedback, canActivate: [authGuard] },
  { path: 'partner-onboarding', component: PartnerOnboarding, canActivate: [authGuard] },
  { path: 'cache-refresh', component: CacheRefresh, canActivate: [authGuard] },
  { path: 'order-management', component: OrderManagement, canActivate: [authGuard] },
  { path: 'manage-banner', component: ManageBanner, canActivate: [authGuard] },
  { path: 'user-report', component: UserReport, canActivate: [authGuard] },
  { path: 'service-report', component: ServiceReport, canActivate: [authGuard] },
  { path: 'partner-report', component: PartnerReport, canActivate: [authGuard] },
  { path: 'dept-report/monthly', component: MonthlyReport, canActivate: [authGuard] },
  { path: 'dept-report/yearly', component: YearlyReport, canActivate: [authGuard] },
  { path: 'dept-report/top-search', component: TopDepartmentSearch, canActivate: [authGuard] },
  { path: 'app-inside/services', component: Services, canActivate: [authGuard] },
  { path: 'app-inside/services/:deptId', component: Services, canActivate: [authGuard] },
  { path: 'app-inside/bi-token', component: BiTokenPage, canActivate: [authGuard] },
  { path: 'app-inside/bi-token/create', component: CreateBiToken, canActivate: [authGuard] },
  { path: 'app-inside/upload-translation', component: UploadTranslation, canActivate: [authGuard] },
  { path: 'app-inside/manage-group', component: ManageGroup, canActivate: [authGuard] },
  { path: 'app-inside/manage-group/:deptId', component: ManageGroup, canActivate: [authGuard] },
  { path: 'app-inside/manage-group/:deptId/create', component: CreateGroup, canActivate: [authGuard] },
  { path: 'service-onboard', component: ServiceOnboard, canActivate: [authGuard] },
  { path: 'services-plus/manage-scheme', component: ManageScheme, canActivate: [authGuard] },
  { path: 'services-plus/create-scheme', component: CreateScheme, canActivate: [authGuard] },
  { path: 'services-plus/scheme-mapping', component: SchemeMapping, canActivate: [authGuard] },
  { path: 'user-management', component: UserManagement, canActivate: [adminGuard] },
  { path: 'user-management/create', component: CreateUser, canActivate: [adminGuard] },
  { path: 'user-management/manage/:userId', component: ManagePermissions, canActivate: [adminGuard] },
  { path: 'role-management', component: RoleManagement, canActivate: [adminGuard] },
  { path: 'permissions', component: PermissionsPage, canActivate: [adminGuard] },
  { path: 'onboard-requests', component: OnboardRequests, canActivate: [adminGuard] },
  { path: 'manage-email/email-group', component: EmailGroupPage, canActivate: [authGuard] },
  { path: 'manage-email/view-email', component: ViewEmailPage, canActivate: [authGuard] },
  { path: 'manage-email/custom-email', component: CustomEmailPage, canActivate: [authGuard] },
  { path: 'view-service/:id', component: ViewService, canActivate: [authGuard] },
  { path: 'edit-service/:id', component: EditService, canActivate: [authGuard] },
  
  // Default route
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
