// app/dashboard/page.tsx (or wherever your Dashboard page is)

import Statistic from '@/components/shared/layout/dashboard/statistic'
import { columns } from '@/components/shared/layout/dashboard/Tables/Files/columns';
import { DataTable } from '@/components/shared/layout/dashboard/Tables/Files/files-table';
import { logColumns } from '@/components/shared/layout/dashboard/Tables/log/logColumns';
import { LogsDataTable } from '@/components/shared/layout/dashboard/Tables/log/logs-table';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { fetchFiles } from '@/lib/actions/files';
import { fetchLogs } from '@/lib/actions/logs';
import { checkMediaAccess, checkLogAccess, getUser, verifySession } from '@/lib/dal';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NCSC | Dashboard',
  description: 'Welcome',
}

export default async function Dashboard() {
  const session = await verifySession();
  const user = await getUser();

  const hasMediaAccess = checkMediaAccess(user);
  const hasLogAccess = checkLogAccess(user);

  // Conditionally fetch only if needed
  const [files, logs] = await Promise.all([
    hasMediaAccess ? fetchFiles() : null,
    hasLogAccess ? fetchLogs() : null,
  ]);

  if(!session.isAuth) {
    return <>Not Authorized</>
  }
  else {
    return (
      <div className='mx-auto w-full max-w-screen-xl px-3 py-3'>
        <div className='py-6 flex flex-col gap-3'>
          <p className='px-4 py-1.5 rounded-full border border-border w-fit text-sm font-semibold text-muted-foreground'>Dashboard</p>
          <h1 className='font-semibold text-4xl px-3'>Hello <span className='capitalize'>{user?.username}</span>!</h1>
        </div>
  
        <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-3">
          <Statistic chartComponent='line' />
          <Statistic chartComponent='bar' />
          <Statistic chartComponent='pie' />
        </div>
  
        {hasMediaAccess && Array.isArray(files) && (
          <div className='mt-6'>
            <Card>
              <CardHeader>{/* Optional Header */}</CardHeader>
              <CardContent>
                <DataTable columns={columns} data={files} />
              </CardContent>
            </Card>
          </div>
        )}
  
        {hasLogAccess && Array.isArray(logs) && (
          <div className='mt-6'>
            <Card className='bg-background'>
              <CardHeader>{/* Optional Header */}</CardHeader>
              <CardContent>
                <LogsDataTable columns={logColumns} data={logs} />
              </CardContent>
              <CardFooter>Suspicious activity</CardFooter>
            </Card>
          </div>
        )}
      </div>
    );
  }

 
}
