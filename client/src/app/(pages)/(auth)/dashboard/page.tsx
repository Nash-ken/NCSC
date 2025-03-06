import { getUser } from '@/lib/dal'
import React from 'react'

const Dashboard = async () => {
  const user = await getUser();
  
  return (
    <div className='p-6'>
      <h1 className=' capitalize'>{user?.username}</h1>
    </div>
  )
}

export default Dashboard