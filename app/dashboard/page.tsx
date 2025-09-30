import { Logout } from '@/components/Logout';
import { requireAuth } from '../lib/session';
import { redirect } from 'next/navigation';

const Dashboard = async () => {
    const session = await requireAuth();

    if(!session){
        redirect("/auth/signin")
    }
  return (
    <div>
      <h1>Dashboard</h1>
      <Logout>Logout</Logout>
    </div>
  )
}

export default Dashboard;
