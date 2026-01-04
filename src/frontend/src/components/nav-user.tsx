import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';

import { Link } from './ui/link';

export function NavUser() {
  const { user } = useAuth();

  // Get initials from email
  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : '??';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" render={<Link to="/user-settings" />}>
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.picture ?? ''} alt={user?.email ?? ''} />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {user?.email ?? 'User'}
            </span>
            <span className="truncate text-xs">
              {user?.isEmailConfirmed ? 'Verified' : 'Not verified'}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
