import { IconButton, Menu, MenuItem } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import HistoryIcon from '@mui/icons-material/History'
import LogoutIcon from '@mui/icons-material/Logout'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { clearHistory } from '../common/history'

export default function ProfileMenu() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const isMenuOpen = Boolean(anchorEl)

    const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }, [])

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null)
    }, [])

    const handleHistoryClick = useCallback(() => {
        navigate('/history')
        handleMenuClose()
    }, [handleMenuClose, navigate])

    const handleLogoutClick = useCallback(() => {
        clearHistory();
        handleMenuClose();
        navigate('/')
    }, [handleMenuClose])

    return (
        <>
            <IconButton aria-label={t('app.profile')} onClick={handleMenuOpen} size="small">
                <AccountCircleIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                aria-label={t('app.profile')}
            >
                <MenuItem onClick={handleHistoryClick} aria-label={t('app.history')}>
                    <HistoryIcon fontSize="small" sx={{ mr: 1 }} aria-hidden="true" />
                    {t('app.history')}
                </MenuItem>
                <MenuItem onClick={handleLogoutClick} aria-label={t('app.logout')}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} aria-hidden="true" />
                    {t('app.logout')}
                </MenuItem>
            </Menu>
        </>
    )
}
