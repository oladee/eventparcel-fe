// /types/host.ts

export interface WeekOrders {
    week: string;
    orders: number;
  }
  
  export interface WeekDelivered {
    week: string;
    delivered: number;
  }
  
  export interface WeekPending {
    week: string;
    pending: number;
  }
  
  export interface OrdersSummary {
    overall: number;
    byWeek: WeekOrders[];
    growthRate: number;
  }
  
  export interface DeliveredSummary {
    overall: number;
    byWeek: WeekDelivered[];
    growthRate: number;
  }
  
  export interface PendingSummary {
    overall: number;
    byWeek: WeekPending[];
    growthRate: number;
  }
  
  export interface InvitesSummary {
    totalInvites: number;
    totalViewed: number;
    viewedRate: number;
  }
  
  export interface SalesPoint {
    month: string;
    sales: number;
  }
  
  export interface DailySalesPoint {
    day: string;
    sales: number;
  }
  
  export interface SalesOverview {
    totalAmount: number;
    growthRate: number;
    monthlySales: SalesPoint[];
    dailySales: DailySalesPoint[];
  }
  
  export interface OverviewData {
    ordersSummary: {
      totalOrders: OrdersSummary;
      totalDelivered: DeliveredSummary;
      pendingOrders: PendingSummary;
    };
    invitesSummary: InvitesSummary;
    nairaSales: SalesOverview;
    dollarSales: SalesOverview;
  }
  
  export interface HostDetails {
    hostName: string;
    email: string;
    phoneNumber: string;
    location: string;
    overallSales: {
      NGN: number;
      USD: number;
    };
    imageUrl: string | null;
    role: string;
    lastLogin: string;
    status: string;
    createdAt: string;
  }
  
  export interface PickupDetails {
    email: string;
    phoneNumber: string;
    location: string;
    imageUrl: string | null;
    contactName: string;
    pickUpLocation: string;
  }
  

// export interface SummarySection {
//     title: string;
//     value: number | string;
//     delta?: string;
//     highlight?: boolean;
//   }
  