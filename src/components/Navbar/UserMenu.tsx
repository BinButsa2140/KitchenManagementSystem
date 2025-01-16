'use client';
import UserIcon from './UserIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

const links = [
  {label:'profile',href:'/profile'}
]

const UserMenu = () => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserIcon/>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
            {
              links.map((data, index)=>{
                return(
                  <DropdownMenuItem key={index}><Link href={data.href}>{data.label}</Link></DropdownMenuItem>
                )
              })
            }
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default UserMenu;
