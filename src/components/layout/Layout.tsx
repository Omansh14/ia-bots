import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="max-h-screen min-h-screen w-full">
      <Header />
      <main className='bg-background py-8 px-6'>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
