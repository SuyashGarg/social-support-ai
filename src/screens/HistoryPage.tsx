import { Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getHistoryEntries } from '../common/history'
import { historyPageStyles as styles } from './HistoryPage.styles'
import { useLanguage } from '../context/LanguageContext'

export default function HistoryPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { isRtl } = useLanguage()

    const history = useMemo(() => getHistoryEntries(), [])

    const handleRowClick = (id: string) => {
        navigate(`/review/${id}`)
    }

    return (
        <Paper variant="outlined" sx={styles.container}>
            <Box sx={styles.header}>
                <Typography variant="h5" component="h2" sx={styles.title}>
                    <Button
                        variant="text"
                        onClick={() => navigate('/')}
                        sx={styles.backButton}
                        startIcon={!isRtl ? <ArrowBackIcon /> : undefined}
                        endIcon={isRtl ? <ArrowForwardIcon /> : undefined}
                    />
                    {t('app.history')}
                </Typography>
            </Box>

            {history.length === 0 ? (
                <Typography variant="body2" sx={styles.empty}>
                    {t('app.noHistory')}
                </Typography>
            ) : (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={styles.tableCellHeader}>{t('app.serialNo')}</TableCell>
                            <TableCell sx={styles.tableCellHeader}>{t('app.name')}</TableCell>
                            <TableCell sx={styles.tableCellHeader}>{t('app.email')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.map((entry, index) => (
                            <TableRow key={entry.id} hover>
                                <TableCell>
                                    <Button
                                        variant="text"
                                        onClick={() => handleRowClick(entry.id)}
                                        sx={styles.linkButton}
                                    >
                                        {index + 1}
                                    </Button>
                                </TableCell>
                                <TableCell>{String(entry.data.fullName ?? '-')}</TableCell>
                                <TableCell>{String(entry.data.email ?? '-')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Paper>
    )
}
