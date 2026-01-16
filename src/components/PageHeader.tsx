import { Box, Container, Typography } from '@mui/material'
import { useLanguage } from '../context/LanguageContext'
import { appStyles } from '../App/styles'
import LanguageSwitch from '../components/LanguageSwitch'
import logo from '../assets/logo.png'

export default function PageHeader() {
    const { isRtl } = useLanguage()

    return (
        <Box component="header" sx={appStyles.header}>
            <Container
                disableGutters
                maxWidth={false}
                sx={{ ...appStyles.headerInner, ...(isRtl ? appStyles.toolbarRtl : {}) }}
            >
                <Box sx={appStyles.brand}>
                    <Box component="img" src={logo} alt="Social Support logo" sx={appStyles.logo} />
                    <Typography component="h1" sx={{ ...appStyles.title, ...(isRtl ? appStyles.titleRtl : {}) }}>
                        Social Support
                    </Typography>
                </Box>
                <LanguageSwitch />
            </Container>
        </Box>
    )
}
