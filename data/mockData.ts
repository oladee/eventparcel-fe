export interface Package {
    image: string;
    title: string;
    description: string;
    amount: number;
    packageId: number
    quantity: number
  }
  
 export  interface Group {
    id: number;
    title: string;
    description: string;
    type: "general" | "private";
    packages: Package[];
  }

  export const groups: Group[] = [
    {
      id: 1,
      title: "Investment Club",
      description: "A general investment club for wealth building.",
      type: "private",
      packages: [
        {
          image: "/images/cloth.png",
          title: "Gold Package",
          description: "very good",
          amount: 5000,
          packageId: 1,
          quantity: 10
        },
        {
            image: "/images/cloth.png",
            title: "Platinum Package",
          amount: 10000,
          packageId: 2,
          quantity: 10,
          description: "very good",
        },
        {
          image: "/images/cloth.png",
          title: "Gold Package silver",
          amount: 5000,
          packageId: 3,
          quantity: 10,
          description: "very good",
        },
        {
            image: "/images/cloth.png",
            title: "Platinum Package vip",
          amount: 10000,
          packageId: 4,
          quantity: 10,
          description: "very good",
        },
      ],
    },
    {
      id: 2,
      title: "VIP Savings Group",
      description: "Exclusive savings group with high-interest returns.",
      type: "private",
      packages: [
        {
            image: "/images/cloth.png",
            title: "Basic cap",
          amount: 1000,
          packageId: 1,
          quantity: 10,
          description: "very good",
        },
        {
            image: "/images/cloth.png",
            title: "Premium cap silver",
          amount: 5000,
          packageId: 2,
          quantity: 10,
          description: "very good",
        },
        {
            image: "/images/cloth.png",
            title: "Elite Savings vip",
          amount: 10000,
          packageId: 3,
          quantity: 10,
          description: "very good",
        },
      ],
    },
    {
      id: 3,
      title: "Startup Funders",
      description: "A general group for funding innovative startups.",
      type: "private",
      packages: [
        {
            image: "/images/cloth.png",
            title: "Seed Investor prem",
          amount: 2000,
          packageId: 1,
          quantity: 10,
          description: "very good",
        },
        {
            image: "/images/cloth.png",
            title: "Angel Investor vip",
          amount: 8000,
          packageId: 2,
          quantity: 10,
          description: "very good",
        },
      ],
    },
    {
        id: 4,
        title: "Investment Club",
        description: "A general investment club for wealth building.",
        type: "general",
        packages: [
          {
            image: "/images/cloth.png",
            title: "Gold Package fila",
            amount: 5000,
            packageId: 1,
            quantity: 10,
            description: "very good",
          },
          {
              image: "/images/cloth.png",
              title: "Platinum Package gucci",
            amount: 10000,
            packageId: 2,
            quantity: 10,
            description: "very good",
          },
        ],
      },
      {
        id: 5,
        title: "VIP Savings Group",
        description: "Exclusive savings group with high-interest returns.",
        type: "general",
        packages: [
          {
              image: "/images/cloth.png",
              title: "Basic Savings jersey",
            amount: 1000,
            packageId: 1,
            quantity: 10,
            description: "very good",
          },
          {
              image: "/images/cloth.png",
              title: "Premium Savings fifa",
            amount: 5000,
            packageId: 2,
            quantity: 10,
            description: "very good",
          },
          {
              image: "/images/cloth.png",
              title: "Elite Savings john",
            amount: 10000,
            packageId: 3,
            quantity: 10,
            description: "very good",
          },
        ],
      },
      {
        id: 6,
        title: "Startup Funders",
        description: "A general group for funding innovative startups.",
        type: "general",
        packages: [
          {
              image: "/images/cloth.png",
              title: "Seed Investor preci",
            amount: 2000,
            packageId: 1,
            quantity: 10,
            description: "very good",
          },
          {
              image: "/images/cloth.png",
              title: "Angel Investor sick",
            amount: 8000,
            packageId: 3,
            quantity: 10,
            description: "very good",
          },
        ],
      },
  ];
  