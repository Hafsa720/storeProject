'use client'
//import { Input } from '../ui/input'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { useState, useEffect } from 'react'
import React from 'react'
import { Input } from '@/components/ui/input'
export default function NavSearch() {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search')?.toString || ''
  )
  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    replace(`/products?${params.toString()}`)
  }, 500)
  useEffect(() => {
    const searchValue = searchParams.get('search')
    if (!searchValue) {
      setSearchTerm('')
    }
  }, [searchParams])
  return (
    <Input
      type='search'
      placeholder='search product...'
      className='max-w-xs dark:bg-muted'
      onChange={(e) => {
        setSearchTerm(e.target.value)
        handleSearch(e.target.value)
      }}
      value={searchTerm}
    />
  )
}
