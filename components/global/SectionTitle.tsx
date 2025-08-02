import React from 'react'
import { Separator } from '../ui/separator'
function SectionTitle({text}:{text:string}) {
  return (
    <div>
<h2 className='text-2xl font-bold text-center mb-4 capitalize tracking-wider'>
  {text}
</h2>
<Separator/>
    </div>
  )
}

export default SectionTitle