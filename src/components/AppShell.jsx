import { useState, useEffect } from 'react';
import { Box, IconButton, useMediaQuery, useTheme, BottomNavigation, BottomNavigationAction, Paper, Typography } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Sidebar from './Sidebar';
import BoardHeader from './BoardHeader';
import { BoardHeaderProvider } from '../contexts/BoardHeaderContext';

export default function AppShell({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));

  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Derive active tab from current path
  const [navValue, setNavValue] = useState(0);
  useEffect(() => {
    if (location.pathname.startsWith('/time-tracker')) setNavValue(0);
    else if (location.pathname.startsWith('/workorders')) setNavValue(1);
    else if (location.pathname.startsWith('/locations')) setNavValue(2);
  }, [location.pathname]);

  // Auto-expand on large screens, collapse on smaller
  useEffect(() => {
    if (!isMobile) {
      setCollapsed(!isLarge);
    }
  }, [isLarge, isMobile]);

  // Close mobile drawer when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100dvh',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <BoardHeaderProvider>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Mobile top bar */}
          {isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                height: 56,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                flexShrink: 0,
                zIndex: 10,
              }}
            >
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ mr: 1.5, color: 'text.secondary' }}
              >
                <MenuIcon sx={{ fontSize: 24 }} />
              </IconButton>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111', flex: 1, letterSpacing: '-0.01em' }}>
                Technician Portal
              </Typography>
            </Box>
          )}

          {/* Page content area */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <BoardHeader />
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              <Outlet />
            </Box>
          </Box>
          {/* Mobile Bottom Navigation */}
          {isMobile && (
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={4}>
              <BottomNavigation
                showLabels
                value={navValue}
                onChange={(event, newValue) => {
                  setNavValue(newValue);
                  if (newValue === 0) navigate('/time-tracker');
                  if (newValue === 1) navigate('/workorders');
                  if (newValue === 2) navigate('/locations');
                }}
                sx={{
                  height: 64,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  '& .MuiBottomNavigationAction-root': {
                    color: 'text.disabled',
                    '&.Mui-selected': { color: 'primary.main' },
                    minWidth: 0,
                    px: 0,
                  },
                  '& .MuiBottomNavigationAction-label': {
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    mt: 0.5,
                    '&.Mui-selected': { fontSize: '0.65rem' },
                  }
                }}
              >
                <BottomNavigationAction label="Time Tracker" icon={<TimerOutlinedIcon sx={{ fontSize: 24 }} />} />
                <BottomNavigationAction label="Work Orders" icon={<WorkOutlineIcon sx={{ fontSize: 24 }} />} />
                <BottomNavigationAction label="Locations" icon={<LocationOnOutlinedIcon sx={{ fontSize: 24 }} />} />
              </BottomNavigation>
            </Paper>
          )}

          {/* Spacer for bottom nav on mobile */}
          {isMobile && <Box sx={{ height: 64, flexShrink: 0 }} />}
        </Box>
      </BoardHeaderProvider>
    </Box>
  );
}