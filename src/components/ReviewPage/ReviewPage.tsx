import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getRowStyles, reviewPageStyles as styles } from './ReviewPage.styles';
import { formSteps } from '../../data/formMock';
import { getHistoryEntryById } from '../../common/history';
import { useLanguage } from '../../context/LanguageContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import isEmpty from 'lodash/isEmpty';
import { clearSessionData, getFormResponse } from '../../common/storage';

export default function ReviewPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isRtl } = useLanguage();
    const { historyId } = useParams<{ historyId?: string }>();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [historyId]);

    const response = useMemo(() => {
        if (historyId) {
            const entry = getHistoryEntryById(historyId);
            if (!isEmpty(entry)) { return entry?.data ?? null; }
        }
        const storedResponse = getFormResponse();
        clearSessionData();
        return storedResponse;
    }, [historyId]);

    const handleStartOver = () => {
        navigate('/step/0');
    };

    const sections = useMemo(() => {
        if (!response) return [];
        return formSteps.map((step) => {
            const items = step.elements
                .map((element) => {
                    if (element.name === 'consent') return null;
                    const value = response[element.name];
                    const isEmpty =
                        value === null ||
                        typeof value === 'undefined' ||
                        (typeof value === 'string' && value.trim() === '');

                    const optionLabelKey = element.options?.find((option) => option.value === value)?.labelKey;
                    const rawValue = isEmpty
                        ? '-'
                        : typeof value === 'boolean'
                            ? t(value ? 'app.yes' : 'app.no')
                            : optionLabelKey
                                ? t(optionLabelKey)
                                : element.prefix
                                    ? `${element.prefix} ${String(value)}`
                                    : String(value);
                    const displayValue =
                        rawValue.length > 0 ? rawValue.charAt(0).toUpperCase() + rawValue.slice(1) : rawValue;

                    return {
                        name: element.name,
                        label: t(element.labelKey),
                        value: displayValue,
                    };
                })
                .filter(Boolean) as Array<{ name: string; label: string; value: string }>;

            return {
                id: step.id,
                title: t(step.titleKey),
                items,
            };
        });
    }, [response, t]);

    return (
        <Paper variant="outlined" sx={styles.container}>
            <Box sx={styles.content}>
                <Box sx={styles.titleRow}>
                    {historyId && (<Button
                        variant="text"
                        sx={{
                            minWidth: 0,
                            padding: 0,
                            textTransform: 'none' as const,
                        }}
                        onClick={() => navigate(-1)}
                        startIcon={!isRtl ? <ArrowBackIcon /> : undefined}
                        endIcon={isRtl ? <ArrowForwardIcon /> : undefined}
                        aria-label={t('app.back')}
                    />)}
                    {!historyId && <CheckCircleIcon sx={styles.titleIcon} />}
                    <Typography variant="h5" component="h2" sx={styles.title}>
                        {historyId ? t('app.yourRequest') : t('app.preview')}
                    </Typography>
                    {!historyId && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleStartOver}
                            aria-label={t('app.startOver')}
                            sx={{
                                marginLeft: 'auto',
                            }}
                        >
                            {t('app.startOver')}
                        </Button>
                    )}
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
            </Box>
        </Paper>
    );
}
