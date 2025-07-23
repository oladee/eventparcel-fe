import Chart from '@/components/dashboard/chart/Chart'
import Container from '@/components/dashboard/Container'
import Orders from '@/components/dashboard/orders/Orders'
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

    if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  return (
  <>
   <Container>
    <Chart />
    <Orders />
   </Container>
  </>
  )
}

export default Page
