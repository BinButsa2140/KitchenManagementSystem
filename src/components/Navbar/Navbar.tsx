import Link from "next/link";
import UserIcon from './UserIcon';
import UserMenu from './UserMenu';
import { links } from "@/app/utils/links";

const Navbar = () => {
  return (
    <header className="py-5 px-3 border-b-2 border-orange-200 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" aria-label="Homepage" className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors">
          Kitchen
        </Link>
        
        {/* Navigation */}
        <nav>
          <ul className="flex gap-8 items-center">
            {links.map((data, index) => (
              <li key={index}>
                <Link 
                  href={data.href} 
                  aria-label={data.title}
                  className="text-gray-700 hover:text-orange-600 hover:underline transition-colors"
                >
                  {data.title}
                </Link>
              </li>
            ))}
            
            {/* User Menu */}
            <li>
              <UserMenu />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;