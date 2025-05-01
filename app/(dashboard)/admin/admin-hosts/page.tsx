"use client"
import React, { useState, useMemo } from 'react'
import AdminContainer from '@/components/admin/AdminContainer'
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi'
import HostsTable, { Host } from '@/components/admin/hosts/HostsTable'

const hostsData: Host[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: ['Chieko Chute','Annabel Rohan','Pedro Huard','Jamel Eusebio','Augustina Midgett','Geoffrey Mott'][i % 6],
  email: ['chieko@mail.com','rohan_anna@mail.com','pedrohuar@mail.com','eusebio234@mail.com','midgett245@mail.com','bettina@mail.com'][i % 6],
  location: ['Lagos, NG','Lagos, NG','Oyo, NG','Ogun, NG','-','-'][i % 6],
  sales: ['₦1,560,000','₦61.49M | $964','₦130.85M','₦1,560,000','-','-'][i % 6],
  lastLogin: '12 Mar, 2025',
  status: ['Active','Active','Inactive','Active','Unverified','Unverified'][i % 6] as
    | 'Active'
    | 'Inactive'
    | 'Unverified',
}))

type StatusTab = 'All Host' | 'Active' | 'Inactive' | 'Unverified'
const statusTabs: StatusTab[] = ['All Host','Active','Inactive','Unverified']

const HostsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StatusTab>('All Host')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  const filtered = useMemo(() => {
    let data = hostsData
    if (activeTab !== 'All Host') data = data.filter(h => h.status === activeTab)
    if (search) data = data.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.email.toLowerCase().includes(search.toLowerCase()))
    return data
  }, [activeTab, search])

  const pageCount = Math.ceil(filtered.length / pageSize)
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <AdminContainer>
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Tab Select */}
          <div className="flex items-center bg-white rounded-2xl shadow px-4 py-2">
            <span className="font-medium text-gray-500">Show:</span>
            <select
              value={activeTab}
              onChange={e => { setActiveTab(e.target.value as StatusTab); setPage(1) }}
              className="ml-2 bg-transparent border-none focus:ring-0 text-black font-medium"
            >
              {statusTabs.map(tab => <option key={tab} value={tab}>{tab}</option>)}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center bg-white rounded-2xl shadow px-4 py-2">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or others..."
              className="ml-2 w-full bg-transparent border-none focus:ring-0"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>

          {/* Filters & Export */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center bg-white rounded-2xl shadow px-4 py-2 text-gray-700">
              <FiFilter className="mr-2" /> Filters
            </button>
            <button className="flex items-center bg-white rounded-2xl shadow px-4 py-2 text-gray-700">
              <FiDownload className="mr-2" /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <HostsTable hosts={pageData} />

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Show result:</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="bg-white border rounded-md px-2 py-1"
            >
              {[6,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-2">‹</button>
            {Array.from({ length: pageCount },(_,i)=>(i+1)).map(p=> (
              <button key={p} onClick={()=>setPage(p)} className={`px-3 py-1 rounded-md ${p===page?'bg-green-100 text-green-600':'text-gray-500'}`}>{p}</button>
            ))}
            <button disabled={page===pageCount} onClick={()=>setPage(p=>Math.min(pageCount,p+1))} className="px-2">›</button>
          </div>
        </div>
      </div>
    </AdminContainer>
  )
}

export default HostsPage