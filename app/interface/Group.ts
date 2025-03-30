export interface Package {
    packageImgUrls: string[];
    packageTitle: string;
    packageDescription: string;
    _id: string;
    packageQuantity: number;
    packagePriceCurrency: string;
    packagePrice: number;
    packageDelivery: string[];
  }
  
 export  interface Group {
    _id: string;
    groupName: string;
    groupDescription: string;
    groupPrivacy: string;
    groupCurrency: string;
    packages: Package[];
    link?: string;
  }
