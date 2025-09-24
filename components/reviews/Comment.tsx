'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'

function Comment({ comment }: { comment: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }
  const longComment = comment.length > 130

  return (
    <div>
      <p>
        {longComment && (
          <Button
            variant='link'
            className='pl-0 text-muted-foreground'
            onClick={toggleExpanded}
          >
            {isExpanded ? 'show less' : 'show-more'}
          </Button>
        )}
      </p>
    </div>
  )
}

export default Comment
