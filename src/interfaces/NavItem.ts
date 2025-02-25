export interface NavItem {
    path: string;
    label: string;
    requireAuth?: boolean;
    requireBusiness?: boolean;
    requireAdmin?: boolean;
}