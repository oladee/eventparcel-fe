export interface Package {
    packageImgUrls: string[];
    packageTitle: string;
    packageDescription: string;
    _id: string;
    packageQuantity: number;
    packagePriceCurrency: string;
    packageSize: string;
    packagePrice: number;
    packageDelivery: string[];
  }

  export interface Contact {
    [key: string]: any;
  }
  
  export interface GroupSummary {
    currency: string;
    overallSales: number;
    packagesSold: number;
    stock: number;
  }

 export  interface Group {
    _id: string;
    groupName: string;
    groupDescription: string;
    groupPrivacy: string;
    groupCurrency: string;
    packages: Package[];
    summary: GroupSummary[];
    contacts: Contact[];
    link?: string;
    isDisabled:boolean;
  }
