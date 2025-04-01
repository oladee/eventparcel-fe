"use client"

import ContentLoader from "react-content-loader";
import Container from "../Container";

const SkeletonLoader: React.FC = () => {
  return (
    <Container>
      <div className="bg-white rounded-[18px] w-full h-full p-4 flex flex-col gap-6">
        {/* Top Section Skeleton */}
        <div className="flex items-start sm:items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-12 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="w-full relative">
          <ContentLoader
            speed={2}
            width="100%"
            height={352}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            {/* X-Axis */}
            <rect x="0" y="320" rx="3" ry="3" width="100%" height="10" />
            {/* Y-Axis */}
            <rect x="0" y="0" rx="3" ry="3" width="10" height="320" />
            {/* Bars */}
            <rect x="20" y="200" rx="3" ry="3" width="40" height="120" />
            <rect x="80" y="150" rx="3" ry="3" width="40" height="170" />
            <rect x="140" y="180" rx="3" ry="3" width="40" height="140" />
            <rect x="200" y="100" rx="3" ry="3" width="40" height="220" />
            <rect x="260" y="130" rx="3" ry="3" width="40" height="190" />
          </ContentLoader>
        </div>
      </div>
    </Container>
  );
};

export default SkeletonLoader

