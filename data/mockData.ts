interface Package {
    image: string;
    title: string;
    amount: number;
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
          amount: 5000,
        },
        {
            image: "/images/cloth.png",
            title: "Platinum Package",
          amount: 10000,
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
            title: "Basic Savings",
          amount: 1000,
        },
        {
            image: "/images/cloth.png",
            title: "Premium Savings",
          amount: 5000,
        },
        {
            image: "/images/cloth.png",
            title: "Elite Savings",
          amount: 10000,
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
            title: "Seed Investor",
          amount: 2000,
        },
        {
            image: "/images/cloth.png",
            title: "Angel Investor",
          amount: 8000,
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
            title: "Gold Package",
            amount: 5000,
          },
          {
              image: "/images/cloth.png",
              title: "Platinum Package",
            amount: 10000,
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
              title: "Basic Savings",
            amount: 1000,
          },
          {
              image: "/images/cloth.png",
              title: "Premium Savings",
            amount: 5000,
          },
          {
              image: "/images/cloth.png",
              title: "Elite Savings",
            amount: 10000,
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
              title: "Seed Investor",
            amount: 2000,
          },
          {
              image: "/images/cloth.png",
              title: "Angel Investor",
            amount: 8000,
          },
        ],
      },
  ];
  