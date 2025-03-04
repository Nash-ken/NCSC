import { getUser } from '@/lib/dal'
import React from 'react'

const Dashboard = async () => {
  const user = await getUser();
  console.log(user)
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard