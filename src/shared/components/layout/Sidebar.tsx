// FILE: src/shared/components/layout/Sidebar.tsx
// PURPOSE: Collapsible navigation drawer for authenticated layout exposing route links and logout action.
// NOTES: Width constants (DRAWER_WIDTH/MINI_DRAWER_WIDTH) inform AuthLayout sizing; integrates with useAuth for logout.
import { Settings, Menu, ChevronLeft, Dashboard as DashboardIcon, DarkMode, LightMode } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/useAuth';
import { useThemeMode } from '../../../app/providers/ThemeModeContext';

export const DRAWER_WIDTH = 240;
export const MINI_DRAWER_WIDTH = 72;

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  items?: ReadonlyArray<{ label: string; icon: React.ReactNode; path: string }>;
}

export const defaultNavItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Settings', icon: <Settings />, path: '/settings' },
] as const;

export default function Sidebar({ open, onToggle, items = defaultNavItems }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { mode, toggle } = useThemeMode();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: 'width 0.3s',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Top navigation items */}
      <List>
        {items.map(({ label, icon, path }) => (
          <Tooltip key={label} title={!open ? label : ''} placement="right">
            <ListItemButton onClick={() => navigate(path)}>
              <ListItemIcon>{icon}</ListItemIcon>
              {open && <ListItemText primary={label} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      {/* Bottom actions: logout and collapse/expand */}
      <List sx={{ mt: 'auto' }}>
        <ListItemButton onClick={toggle}>
          <ListItemIcon>
            <IconButton edge="start" size="small">
              {mode === 'light' ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
            </IconButton>
          </ListItemIcon>
          {open && <ListItemText primary={mode === 'light' ? 'Dark mode' : 'Light mode'} />}
        </ListItemButton>

        <ListItemButton onClick={logout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Logout" />}
        </ListItemButton>

        <ListItemButton onClick={onToggle}>
          <ListItemIcon>{open ? <ChevronLeft /> : <Menu />}</ListItemIcon>
        </ListItemButton>
      </List>
    </Drawer>
  );
}
