import { JSX, lazy, useEffect, useState } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Regular } from '~/components/common/Text';
import useResources from '~/hooks/useResources';
import '~/styles/ErrorBondaryStyles.scss';
import nProgress from 'nprogress';
import { AppError, ErrorTypeEnum } from './appError';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import { Card, TableContainer } from '@mui/material';
import useSessionContext from '~/context/sessionContext';

const InputTextAreaField = lazy(() => import('../components/formMaker/elements/InputTextAreaField'));

export default function ErrorHandler({ error }: FallbackProps): JSX.Element {
    const { ip, gear, email } = useSessionContext();
    const isAppError = error instanceof AppError;
    const [_source, setSource] = useState<string>('');
    const [_code, setCode] = useState<string>('');
    const { translate } = useResources();

    const errorDetails = isAppError
        ? [
              { label: 'Type', data: ErrorTypeEnum[(error as AppError).type] },
              { label: 'Code', data: (error as AppError).code },
              { label: 'Message', data: error.message },
              { label: 'Détail', data: (error as AppError).detailedMessage },
              { label: 'Données', data: JSON.stringify((error as AppError).data, null, 2) },
              { label: 'Page', data: window.location.href },
          ]
        : [
              { label: 'Erreur technique', data: (error as Error).message },
              { label: 'Stack', data: (error as Error).stack },
              { label: 'Page', data: window.location.href },
          ];

    async function getErrorContext(error: Error): Promise<void> {
        if (!error.stack) return;

        const match = error.stack.match(/(https?:\/\/[^\s]+):(\d+):(\d+)/);
        if (!match) return;

        const [, fileUrl, line, column] = match;
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('Impossible de charger le fichier source.');

            const text = await response.text();
            const lines = text.split('\n');
            const errorLine = parseInt(line, 10);

            setSource(`Erreur trouvée dans ${fileUrl} à la ligne ${line}, colonne ${column}`);
            setCode(
                lines
                    .slice(errorLine - 2, errorLine + 3) // Sélectionne 5 lignes autour de l'erreur
                    .map((line, index) => {
                        const lineNumber = errorLine - 2 + index + 1; // Calcule le numéro de ligne réel
                        if (lineNumber === errorLine) {
                            return `<span class="bg-danger-subtle">${lineNumber.toString().padStart(4, ' ')} | ${line}</span>`; // Ajoute un chevron pour la ligne de l'erreur
                        }
                        return `${lineNumber.toString().padStart(4, ' ')} | ${line}`; // Ajoute le numéro de ligne avec un séparateur
                    })
                    .join('\n') // Retour à la ligne pour chaque ligne de code
            );
        } catch (err) {
            console.error("Impossible d'extraire le contexte de l'erreur :", err);
        }
    }

    useEffect(() => {
        console.error('error handled', error);
        getErrorContext(error as Error);
        nProgress.done();
    }, []);

    return (
        <Card sx={{ margin: 1, maxWidth: '800px' }}>
            <Box>
                <Box sx={{ padding: 2 }}>
                    <Box component="form" method="POST" style={{ maxWidth: 800 }}>
                        <Regular sx={{ fontSize: 13, textAlign: 'center' }}>
                            <b>{translate('error.errorBoundary.sorry')}</b> {translate('error.errorBoundary.firstErrorMessage')}{' '}
                            <b style={{ textDecoration: 'underline', color: 'blue' }}>
                                <a href={translate('error.errorBoundary.supportEmail') as string}>{translate('error.errorBoundary.technicalStaff')}</a>
                            </b>
                            <br />
                            {translate('error.errorBoundary.thanks')}
                            <br />
                            <br />
                            {translate('error.errorBoundary.toSendMessage')}
                            <br />
                            <Regular sx={{ fontSize: 13, fontWeight: 'bold' }} component={'span'} color={'#E00'}>
                                {translate('error.errorBoundary.pleaseSend')}
                            </Regular>{' '}
                            {translate('error.errorBoundary.thenClick')} "<b>{translate('common.sendMessage')}</b>"
                            <br />
                        </Regular>
                        <InputTextAreaField sx={{ width: '100%' }} showLabel={false} rows={5} id="Body" label="message" />
                        <br />
                        <input type="hidden" defaultValue={email} name="From" />
                        <Box className="d-flex align-items-center justify-content-center" sx={{ marginBottom: 1 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                style={{ fontWeight: 'bold' }}
                                sx={{ width: '30%', minWidth: 200, alignItems: 'center', backgroundColor: '#6599CC' }}
                                name="Submit"
                                className="button"
                            >
                                {translate('common.sendMessage')}
                            </Button>
                        </Box>
                        <input type="hidden" defaultValue={(error as Error).message} name="Diagnostic" />
                        <input type="hidden" defaultValue={(error as Error).stack} name="Source" />
                        <input type="hidden" defaultValue={(error as Error).stack} name="TableRowace" />
                        <input type="hidden" defaultValue={window.location.href} name="Page" />
                        <input type="hidden" defaultValue={dayjs().format('DD MMMM YYYY HH:mm:ss')} name="DateTime" />
                        <input type="hidden" defaultValue={gear} name="Browser" />
                        <input type="hidden" defaultValue={ip} name="Address" />
                        <input type="hidden" defaultValue={window.location.href} name="Referer" />
                    </Box>
                </Box>
            </Box>
            <Box>
                <Box sx={{ padding: 0 }} className="w-100">
                    <TableContainer>
                        <Table className="rounded w-100" width={'fit-content'} cellSpacing={0} cellPadding={0}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ padding: 0.5, cursor: 'pointer' }} align="left" colSpan={2}>
                                        {translate('error.errorBoundary.errorReport')}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {errorDetails.map((err, i) => (
                                    <TableRow key={i}>
                                        <TableCell sx={{ padding: 1 }}>{err.label}</TableCell>
                                        <TableCell sx={{ padding: 1 }}>
                                            <pre className="m-0">
                                                <code>{err.data}</code>
                                            </pre>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Card>
    );
}
