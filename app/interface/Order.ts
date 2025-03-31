import { Group } from "./Group";

// Core Entity Structure
interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Event System
// interface EventHost {
//   email: string;
//   firstName: string;
//   lastName: string;
//   user: string; // Reference to User._id
// }

interface EventImage {
  publicId: string;
  url: string;
}

export interface EventGroup extends BaseEntity {
  _id: string;
  groupName: string;
  groupDescription: string;
  groupPrivacy: string; 
  groupCurrency: string;
  event: string;
  isDisabled: boolean;
  link: string;
  contacts: any[]; // Define a more specific type if possible
  packages: string[]; // Array of package IDs
}

export interface Event extends BaseEntity {
  eventName: string;
  description: string;
  eventLocation: string;
  date: string;
  time: string;
  eventImgUrl: string;
  coHosts: string[]; // Array of User._id
  groups: string[];  // Array of EventGroup._id
  isDisabled: boolean;
  accountTypes: {
    naira: boolean;
    dollar: boolean;
  };
}

// Package System
// interface PackageImage {
//   publicIds: string[];
//   urls: string[];
// }

// interface PackageDelivery {
//   methods: string[];
// }

// interface Package extends BaseEntity {
//   title: string;
//   description: string;
//   images: PackageImage;
//   price: number;
//   currency: "NGN" | string;
//   quantity: number;
//   delivery: PackageDelivery;
//   group: string; // EventGroup._id
// }


// Order System
interface OrderItem {
  _id: string;
  quantity: number;
  deliveryMethod: string;
  packageId: {
    _id: string;
    eventGroup: string;
    packageImgUrls: string[];
    packageImgPublicIds: string[];
    packageTitle: string;
    packagePrice: number;
    packagePriceCurrency: string;
  };
  packageImgUrls: string[]; 
  packagePrice: number;
  packageTitle: string;
}


interface OrderGuest {
  name: string;
  email: string;
  phone: string;
}

export interface Order extends BaseEntity {
  orderId: string;
  event: string; // Event._id
  eventSnapshot?: { // Optional cached data
    name: string;
    image: EventImage;
    location: string;
    date: string;
  };
  guest: OrderGuest;
  guestName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  orderStatus: string;
  items: OrderItem[];
  status: string;
  paymentStatus: string;
  totalAmount: number;
  eventId: Event;
  eventGroupId: Group;
}

// Analytics System
interface WeeklyMetric<T = number> {
  week: string;
  value: T;
}

interface MetricSummary {
  byWeek: WeeklyMetric[];
  growthRate: number;
  overall: number;
}

interface OrderAnalytics {
  pending: MetricSummary;
  delivered: MetricSummary;
  total: MetricSummary;
}

interface InviteAnalytics {
  sent: number;
  viewed: number;
  viewRate: number;
}

interface RecentOrder {
  id: string;
  date: string;
  image: string;
  product: string;
  price: number;
  quantity: number;
  status: string;
}

export enum OrderStatus {
  Pending = "Pending",
  Processing = "Processing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

// Complete API Response
export interface OrderDashboardResponse {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  orders: Order[];
  summary: {
    orders: OrderAnalytics;
    invites: InviteAnalytics;
    recent: RecentOrder[];
  };
}