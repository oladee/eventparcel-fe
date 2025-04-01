import Chart from '@/components/dashboard/chart/Chart'
import Container from '@/components/dashboard/Container'
import Orders from '@/components/dashboard/orders/Orders'
import React from 'react'

const Page = () => {
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
