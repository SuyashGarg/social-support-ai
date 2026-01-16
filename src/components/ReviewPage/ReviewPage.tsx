import { Box, Button, Divider, Paper, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getRowStyles, reviewPageStyles as styles } from './ReviewPage.styles'
import { formSteps } from '../../data/formMock'

export default function ReviewPage() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const clearSessionData = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('socialSupportFormData')
            window.localStorage.removeItem('socialSupportFormResponse')
        }
    }

    const response = useMemo(() => {
        if (typeof window === 'undefined') return null
        try {
            const stored = window.localStorage.getItem('socialSupportFormResponse');
            clearSessionData();
            return stored ? (JSON.parse(stored) as Record<string, string | boolean>) : null
        } catch {
            return null
        }
    }, [])

    const handleStartOver = () => {
        navigate('/step/0')
    };

    const sections = useMemo(() => {
        if (!response) return []
        return formSteps.map((step) => {
            const items = step.elements
                .map((element) => {
                    if (element.name === 'consent') return null
                    const value = response[element.name]
                    const isEmpty =
                        value === null ||
                        typeof value === 'undefined' ||
                        (typeof value === 'string' && value.trim() === '')

                    const optionLabelKey = element.options?.find((option) => option.value === value)?.labelKey
                    const rawValue = isEmpty
                        ? '-'
                        : typeof value === 'boolean'
                            ? t(value ? 'app.yes' : 'app.no')
                            : optionLabelKey
                                ? t(optionLabelKey)
                                : element.prefix
                                    ? `${element.prefix} ${String(value)}`
                                    : String(value)
                    const displayValue =
                        rawValue.length > 0 ? rawValue.charAt(0).toUpperCase() + rawValue.slice(1) : rawValue

                    return {
                        name: element.name,
                        label: t(element.labelKey),
                        value: displayValue,
                    }
                })
                .filter(Boolean) as Array<{ name: string; label: string; value: string }>

            return {
                id: step.id,
                title: t(step.titleKey),
                items,
            }
        })
    }, [response, t])

    return (
        <Paper variant="outlined" sx={styles.container}>
            <Box sx={styles.content}>
                <Box sx={styles.titleRow}>
                    <CheckCircleIcon sx={styles.titleIcon} />
                    <Typography variant="h5" component="h2" sx={styles.title}>
                        {t('app.preview')}
                    </Typography>
                </Box>
                {!response ? (
                    <Typography variant="body2" sx={styles.empty}>
                        {t('app.noData')}
                    </Typography>
                ) : (
                    sections.map((section, sectionIndex) => (
                        <Box key={section.id}>
                            <Typography variant="h6" sx={styles.sectionTitle}>
                                {section.title}
                            </Typography>
                            <Box sx={styles.sectionRows}>
                                {section.items.map((item, index) => (
                                    <Box key={item.name} sx={getRowStyles(index === section.items.length - 1)}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 5 }}>
                                                <Typography variant="body2" sx={styles.rowLabel}>
                                                    {item.label}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 7 }}>
                                                <Typography variant="body2" sx={styles.rowValue}>
                                                    {item.value}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Box>
                            {sectionIndex < sections.length - 1 ? (
                                <Divider sx={styles.sectionDivider} />
                            ) : null}
                        </Box>
                    ))
                )}
                <Box sx={styles.actions}>
                    <Button variant="contained" color="primary" onClick={handleStartOver}>
                        {t('app.startOver')}
                    </Button>
                </Box>
            </Box>
        </Paper>
    )
}
