import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/AuthStore';

function TopBar() {
    const navigate = useNavigate();
    const { jwtUser, user, logout } = useAuthStore()
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = (callback?: () => void) => {
        setAnchorElUser(null);

        setTimeout(() => callback?.())
    };

    const settings = React.useMemo(() => {
        return jwtUser ? [
            { name: 'Profile', onClick: () => navigate('/profile') },
            { name: 'Logout', onClick: logout }
        ] : [
            { name: 'Login', onClick: () => navigate('/auth/login') },
            { name: 'Register', onClick: () => navigate('/auth/register') }
        ]
    }, [jwtUser])

    return (
        <AppBar
            color='transparent' 
            position="static"
            sx={{ boxShadow: '0 1px 0px 0px red' }}
            
        >
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{ justifyContent: 'space-between' }}
                >
                    <Box
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate('/public/home')}
                    >
                        <img
                            src="/src/assets/Logo.png"
                            alt="logo"
                            style={{ height: '2rem', width: 'auto' }}
                        />
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton  
                                onClick={handleOpenUserMenu} 
                            >
                                <Avatar alt={jwtUser?.username} src={user?.avatar} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={() => handleCloseUserMenu()}
                        >
                        {
                            settings.map((setting) => (
                                <MenuItem
                                    key={setting.name} 
                                    onClick={
                                        () => {
                                            handleCloseUserMenu(setting.onClick)
                                        }
                                    }
                                >
                                    <Typography sx={{ textAlign: 'center' }}>{setting.name}</Typography>
                                </MenuItem>
                            ))
                        }
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default TopBar;
