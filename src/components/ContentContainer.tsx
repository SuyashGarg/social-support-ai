import { Box, Container, Typography } from "@mui/material";
import { formSteps } from "../data/formMock";
import { Route, Routes, Navigate } from "react-router-dom";
import { appStyles } from "../App/styles";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";

import MultiStepForm from './MultiStepForm';
import ReviewPage from './ReviewPage/ReviewPage';
import HistoryPage from '../screens/HistoryPage';

function ContentContainer() {
    const { t } = useTranslation();
    const { language, isRtl } = useLanguage();
    const dir = isRtl ? 'rtl' : 'ltr';
    return (
        <Box dir={dir} lang={language}>
            <Container disableGutters sx={appStyles.main}>
                <Routes>
                    <Route path="/" element={<Navigate to="/step/0" replace />} />
                    <Route
                        path="/step/:stepIndex"
                        element={<>
                            <Typography component="h2" sx={appStyles.sectionTitle}>
                                {t('app.submitRequestTitle')}
                            </Typography>
                            <MultiStepForm
                                steps={formSteps}
                                stepLabel={t('app.step')}
                                backLabel={t('app.back')}
                                nextLabel={t('app.next')}
                                submitLabel={t('app.submit')}
                            />
                        </>}
                    />
                    <Route path="/review" element={<ReviewPage />} />
                    <Route path="/review/:historyId" element={<ReviewPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                </Routes>
            </Container>
        </Box>
    );
}

export default ContentContainer;