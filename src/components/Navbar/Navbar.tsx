import Link from "next/link"
import UserIcon from './UserIcon';
import UserMenu from './UserMenu';
import { links } from "@/app/utils/links";


const Navbar = () => {
    return (
        <header className="py-5 px-3 border-2">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo */}
            <Link href="/" aria-label="Homepage" className="text-xl font-bold">
              Kitchen
            </Link>
            
            {/* Navigation */}
            <nav>
              <ul className="flex gap-8 items-center">
                {links.map((data, index) => (
                  <li key={index} className="hover:font-bold transition-all">
                    <Link href={data.href} aria-label={data.title}>
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
    }      
export default Navbar