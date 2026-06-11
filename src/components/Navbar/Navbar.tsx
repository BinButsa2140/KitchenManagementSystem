import Link from "next/link";
import UserIcon from './UserIcon'; // ถ้าไม่ได้ใช้สามารถลบออกได้ครับ
import UserMenu from './UserMenu';
import { links } from "@/app/utils/links";

const Navbar = () => {
  return (
    <header className="py-3 sm:py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link 
          href="/" 
          aria-label="Homepage" 
          className="text-lg sm:text-xl lg:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 flex items-center gap-1 sm:gap-2"
        >
          <span>🍳</span> <span className="hidden sm:inline">Kitchen Hub</span><span className="sm:hidden">Hub</span>
        </Link>
        
        {/* Navigation */}
        <nav>
          <ul className="flex gap-3 sm:gap-6 lg:gap-8 items-center text-xs sm:text-sm lg:text-base text-gray-600 font-medium">
            {links.map((data, index) => (
              <li key={index}>
                <Link 
                  href={data.href} 
                  aria-label={data.title}
                  className="hover:text-orange-600 transition-all duration-200 border-b-2 border-transparent hover:border-orange-600 pb-1"
                >
                  {data.title}
                </Link>
              </li>
            ))}
            
            {/* User Menu */}
            {/* เพิ่มเส้นคั่นด้านซ้ายเพื่อให้ดูแยกสัดส่วนชัดเจน */}
            <li className="ml-2 pl-6 border-l-2 border-gray-100">
              <UserMenu />
            </li>
          </ul>
        </nav>
        
      </div>
    </header>
  );
};

export default Navbar;