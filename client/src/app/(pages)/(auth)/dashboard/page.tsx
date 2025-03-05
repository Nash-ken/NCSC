import { getUser } from '@/lib/dal'
import { headers } from 'next/headers';
import React from 'react'

const Dashboard = async () => {
  const user = await getUser();
  console.log(user)

  const protocol = (await headers()).get('x-forwarded-proto');
  console.log(protocol)
  return (
    <div className='p-6'>
      <h1 className=' capitalize'>{user?.username}</h1>
    </div>
  )
}

export default Dashboard