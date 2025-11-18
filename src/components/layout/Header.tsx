import { Bell } from 'lucide-react';
import { Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/settings');
  }

  const handleCompanyLogoClick = () => {
    navigate('/')
  }
  return (
    <div className="p-5 bg-white flex shadow-md justify-between items-center z-10 relative">
      <img src="/capitall-logo.png" className="h-10 hover:cursor-pointer"  onClick={handleCompanyLogoClick}/>
      <div className="flex gap-4 items-center">
        <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
        <Settings onClick={handleProfileClick} className="h-6 w-6 text-gray-600 cursor-pointer" />
        <Avatar className='h-8 w-8 hover:cursor-pointer'>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>FN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Header;
