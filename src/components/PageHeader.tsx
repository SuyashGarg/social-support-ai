import { Box, Container, Typography } from '@mui/material'
import { appStyles } from '../App/styles'
import LanguageSwitch from '../components/LanguageSwitch'
import logo from '../assets/logo.png'
import ProfileMenu from './ProfileMenu'
import { useNavigate } from 'react-router-dom'

export default function PageHeader() {
    // const { isRtl } = useLanguage()
    const navigate = useNavigate()
    return (
        <Box component="header" sx={appStyles.header}>
            <Container
                disableGutters
                maxWidth={false}
                sx={appStyles.headerInner}
            >
                <Box sx={appStyles.brand} onClick={() => navigate('/')}>
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
    )
}
