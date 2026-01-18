import { Box, Container, Typography } from '@mui/material';
import { appStyles } from '../App/styles';
import LanguageSwitch from '../components/LanguageSwitch';
import logo from '../assets/logo.png';
import ProfileMenu from './ProfileMenu';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearSessionData } from '../common/storage';

export default function PageHeader() {
    // const { isRtl } = useLanguage()
    const navigate = useNavigate();
    const location = useLocation();

    const handleBrandClick = () => {
        // Clear storage if not already on step/0
        if (location.pathname !== '/step/0' && location.pathname !== '/') {
            clearSessionData();
        }
        navigate('/');
    };

    return (
        <Box component="header" sx={appStyles.header}>
            <Container
                disableGutters
                maxWidth={false}
                sx={appStyles.headerInner}
            >
                <Box
                    component="button"
                    onClick={handleBrandClick}
                    sx={{
                        ...appStyles.brand,
                        flex: { xs: '1 0 auto', md: '0 0 auto' },
                        minWidth: 'fit-content',
                        maxWidth: { xs: 'calc(100% - 140px)', md: 'none' },
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 0.5, md: 1 },
                        flexShrink: 0,
                    }}
                    aria-label="Social Support - Go to home"
                >
                    <Box component="img" src={logo} alt="Social Support logo" sx={appStyles.logo} />
                    <Typography component="h1" sx={appStyles.title}>
                        Social Support
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                    dir="ltr"
                >
                    <LanguageSwitch />
                    <ProfileMenu />
                </Box>
            </Container>
        </Box>
    );
}
