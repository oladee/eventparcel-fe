"use client"
import React, { useState } from 'react'
import AdminContainer from '@/components/admin/AdminContainer'
import IntegrationCard from '@/components/admin/integrations/IntegrationCard'
import FiltersBar from '@/components/admin/integrations/FiltersBar'


type Integration = {
  id: number
  name: string
  logo: string
  description: string
  rating?: { score: number; reviews: number }
  connected: boolean
}

const integrations: Integration[] = [
  { id:1, name:'GIGL', logo:'/images/Frame.png', description:'Build Landing, Product Pages for more sales with 24/7 Support', connected:true },
  { id:2, name:'Junip', logo:'/images/Frame.png', description:'Gather & display reviews (product reviews, store reviews, UGC)', connected:false },
  { id:3, name:'Gamma', logo:'/images/Frame.png', description:'Bring your products to Facebook and Instagram users', connected:true },
  { id:4, name:'Dsers', logo:'/images/Frame.png', description:'Place 100s of orders to AliExpress in seconds & Find suppliers', rating:{score:4.9,reviews:6789}, connected:false },
  { id:5, name:'Spocket', logo:'/images/Frame.png', description:'Drop shipping US/EU Products. Image search on Aliexpress', rating:{score:4.6,reviews:1256}, connected:false },
  { id:6, name:'SPOD', logo:'/images/Frame.png', description:'Fastest Print-On-Demand Dropshipping in US & EU', rating:{score:4.9,reviews:2805}, connected:false },
]

const IntegrationsPage: React.FC = () => {
  const [show, setShow] = useState<'All'|'Connected'|'NotConnected'>('All')
  const [workWith, setWorkWith] = useState<'All'|'Shipping'|'Marketing'|'Analytics'>('All')
  const pending = true

  const filtered = integrations.filter(i => {
    if (show==='Connected' && !i.connected) return false
    if (show==='NotConnected' && i.connected) return false
    // TODO: filter workWith by category
    return true
  })


  if (pending) {
    return <div className=" h-full text-center mt-8  flex items-center justify-center">This page is Coming Soon</div>;    
  }

  return (
    <AdminContainer>
      <div className="space-y-6">
        <FiltersBar
          show={show}
          onShowChange={setShow}
          workWith={workWith}
          onWorkWithChange={setWorkWith}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(i => <IntegrationCard key={i.id} {...i} />)}
        </div>
      </div>
    </AdminContainer>
  )
}

export default IntegrationsPage
