import { useCallback, useMemo, useState } from 'react'
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    TextField,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { FormElement } from '../../types/form'
import { generateTextFromOpenAI } from '../../api/axios'
import TextareaElement from './TextareaElement'
import { textareaAssistStyles as styles } from './TextareaAssistElement.styles'

type Props = {
    element: FormElement
    value: string
    label: string
    placeholder: string
    isRtl: boolean
    dir: string
    required?: boolean
    errorMessage?: string | null
    onValueChange: (nextValue: string) => void
    onBlur: React.FocusEventHandler<HTMLTextAreaElement>
}

export default function TextareaAssistElement({
    element,
    value,
    label,
    placeholder,
    isRtl,
    dir,
    required,
    errorMessage,
    onValueChange,
    onBlur,
}: Props) {
    const { t } = useTranslation()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [suggestion, setSuggestion] = useState('')
    const [apiError, setApiError] = useState<string | null>(null)
    const seedText = useMemo(() => (value.trim() ? value.trim() : label), [label, value])

    const handleTextareaChange = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            onValueChange(event.target.value)
        },
        [onValueChange],
    )

    const handleDialogClose = useCallback(() => {
        setIsDialogOpen(false)
        setIsEditing(false)
    }, [])

    const handleHelpClick = useCallback(async () => {
        setIsLoading(true)
        setIsEditing(false)
        setApiError(null)
        try {
            const text = await generateTextFromOpenAI(seedText)
            setSuggestion(text.trim())
            setIsDialogOpen(true)
        } catch (error: any) {
            setApiError(error?.response?.data?.error?.message ?? 'Request failed')
        } finally {
            setIsLoading(false)
        }
    }, [seedText])

    const handleAccept = useCallback(() => {
        if (suggestion) {
            onValueChange(suggestion)
        }
        handleDialogClose()
    }, [handleDialogClose, onValueChange, suggestion])

    const handleEdit = useCallback(() => {
        setIsEditing(true)
    }, [])

    const handleSuggestionChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSuggestion(event.target.value)
    }, [])

    return (
        <Box sx={styles.container}>
            <TextareaElement
                element={element}
                value={value}
                label={label}
                placeholder={placeholder}
                isRtl={isRtl}
                dir={dir}
                required={required}
                errorMessage={errorMessage}
                onChange={handleTextareaChange}
                onBlur={onBlur}
            />

            <Box sx={styles.buttonRow(isRtl)}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleHelpClick}
                    disabled={isLoading}
                    aria-label={t('app.helpMeWrite')}
                    sx={styles.helpButton}
                >
                    {isLoading ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
                    {t('app.helpMeWrite')}
                </Button>
            </Box>

            <Snackbar
                open={Boolean(apiError)}
                autoHideDuration={4000}
                onClose={() => setApiError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity="error"
                    onClose={() => setApiError(null)}
                    sx={styles.errorText}
                >
                    {apiError}
                </Alert>
            </Snackbar>

            <Dialog
                open={isDialogOpen}
                onClose={handleDialogClose}
                fullWidth
                maxWidth="sm"
                aria-labelledby={`${element.id}-suggestion-title`}
            >
                <DialogTitle id={`${element.id}-suggestion-title`}>{t('app.suggestion')}</DialogTitle>
                <DialogContent>
                    {!isEditing ? (<Box>{suggestion}</Box>) : (<TextField
                        multiline
                        minRows={6}
                        fullWidth
                        value={suggestion}
                        onChange={handleSuggestionChange}
                        placeholder={t('app.generating')}
                        disabled={isLoading}
                        InputProps={{ readOnly: !isEditing }}
                        sx={styles.dialogField}
                    />)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>{t('app.discard')}</Button>
                    {!isEditing ? (
                        <Button onClick={handleEdit} disabled={isLoading || !suggestion}>
                            {t('app.edit')}
                        </Button>
                    ) : null}
                    <Button onClick={handleAccept} disabled={isLoading || !suggestion} variant="contained">
                        {t('app.accept')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
