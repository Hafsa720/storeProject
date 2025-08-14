'use client'
import React, { useEffect, useState } from 'react'
import { LuUser } from 'react-icons/lu'
import Image from 'next/image'

function UserIcon() {
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/user')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        if (data.imageUrl) setProfileImage(data.imageUrl)
      })
      .catch(() => {
        // Silently handle error - user might not be authenticated
        console.debug('User not authenticated or error fetching user data')
      })
  }, [])

  if (profileImage) {
    return (
      <Image
        src={profileImage}
        alt='User Icon'
        width={32}
        height={32}
        className='w-8 h-8 rounded-full object-cover'
      />
    )
  }
  return <LuUser className='w-6 h-6 bg-primary rounded-full text-amber-50' />
}

export default UserIcon
