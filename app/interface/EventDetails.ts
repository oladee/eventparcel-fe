export interface InviteDetails {
    event: EventDetails;
    eventGroup: EventGroupContact[];
  }
  
  export interface EventDetails {
    _id: string;
    coHost: any[]; // Adjust if there’s a proper structure
    createdAt: string;
    updatedAt: string;
    date: string;
    time: string;
    eventDescription: string;
    eventImgPublicId: string;
    eventImgUrl: string;
    eventLocation: string;
    eventName: string;
    hostEmail: string;
    hostFirstName: string;
    hostLastName: string;
    isDisabled: boolean;
    isDollarAccount: boolean;
    isNairaAccount: boolean;
    isPickUp: boolean;
    isPlatformDelivery: boolean;
    isSelfManaged: boolean;
    numberOfGroups: number;
    user: null | string; // or a full object depending on backend
    __v: number;
    eventGroups: GroupDetails[];
  }
  
  export interface GroupDetails {
    _id: string;
    groupName: string;
    groupDescription: string;
    groupCurrency: string;
    groupPrivacy: "private" | "general"; // Add more if needed
    isDisabled: boolean;
    link: string;
    event: string;
    packages: PackageDetails[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface PackageDetails {
    _id: string;
    eventGroup: string;
    packageTitle: string;
    packageDescription: string;
    packagePrice: number;
    packagePriceCurrency: string;
    packageQuantity: number | null;
    packageDelivery: string[]; // better as enum if strict
    packageImgUrls: string[];
    packageImgPublicIds: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface EventGroupContact {
    _id: string;
    eventGroupId: string;
    guestName: string;
    phoneNumber: string;
    status: "pending" | "accepted" | "declined"; // adjust to fit backend
    inviteLink: string;
    hasViewed: boolean;
    viewedAt: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  