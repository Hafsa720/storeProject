'use client'
import React, { useEffect, useState } from 'react'
import { LuUser } from 'react-icons/lu'

function UserIcon() {
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        if (data.imageUrl) setProfileImage(data.imageUrl)
      })
      .catch((err) => console.error('Error fetching user data:', err))
  }, [])

  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt='User Icon'
        className='w-8 h-8 rounded-full object-cover'
      />
    )
  }
  return <LuUser className='w-6 h-6 bg-primary rounded-full text-amber-50' />
}

export default UserIcon
