import { JSX, lazy, useContext, useEffect, useState } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Regular } from '~/components/common/Text';
import SessionContext from '~/context/sessionContext';
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

const InputTextAreaField = lazy(() => import('../components/formMaker/elements/InputTextAreaField'));

export default function ErrorHandler({ error }: FallbackProps): JSX.Element {
    const Ses = useContext(SessionContext);
    const isAppError = error instanceof AppError;
    const [_source, setSource] = useState<string>('');
    const [_code, setCode] = useState<string>('');
    const Resources = useResources();

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
              { label: 'Erreur technique', data: error.message },
              { label: 'Stack', data: error.stack },
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
        getErrorContext(error);
        nProgress.done();
    }, []);

    return (
        <>
            <Box className="errortext" sx={{ backgroundColor: '#DDDDDD', borderRadius: 1 }} minWidth="500px" width="60%" margin={1}>
                <Box>
                    <Box>
                        <Box className="errortext" padding={2}>
                            <Box component="form" action="SQLError.aspx" method="post" style={{ maxWidth: 800 }}>
                                <Regular fontSize={13} textAlign={'center'}>
                                    <b>{Resources.translate('error.errorBoundary.sorry')}</b> {Resources.translate('error.errorBoundary.firstErrorMessage')}{' '}
                                    <b style={{ textDecoration: 'underline', color: 'blue' }}>
                                        <a href={Resources.translate('error.errorBoundary.supportEmail') as string}>{Resources.translate('error.errorBoundary.technicalStaff')}</a>
                                    </b>
                                    <br />
                                    {Resources.translate('error.errorBoundary.thanks')}
                                    <br />
                                    <br />
                                    {Resources.translate('error.errorBoundary.toSendMessage')}
                                    <br />
                                    <Regular fontSize={13} fontWeight={'bold'} component={'span'} color={'#E00'}>
                                        {Resources.translate('error.errorBoundary.pleaseSend')}
                                    </Regular>{' '}
                                    {Resources.translate('error.errorBoundary.thenClick')} "<b>{Resources.translate('common.sendMessage')}</b>"
                                    <br />
                                </Regular>
                                <InputTextAreaField sx={{ width: '100%' }} showLabel={false} rows={5} id="Body" label="message" />
                                <br />
                                <input type="hidden" defaultValue={Ses.email} name="From" />
                                <Box display="flex" alignItems="center" justifyContent="center" marginBottom={1}>
                                    <Button type="submit" variant="contained" style={{ fontWeight: 'bold' }} sx={{ width: '30%', minWidth: 200, alignItems: 'center', backgroundColor: '#6599CC' }} name="Submit" className="button">
                                        {Resources.translate('common.sendMessage')}
                                    </Button>
                                </Box>
                                <input type="hidden" defaultValue={error.message} name="Diagnostic" />
                                <input type="hidden" defaultValue={error.stack} name="Source" />
                                <input type="hidden" defaultValue={error.stack} name="TableRowace" />
                                <input type="hidden" defaultValue={window.location.href} name="Page" />
                                <input type="hidden" defaultValue={dayjs().format('DD MMMM YYYY HH:mm:ss')} name="DateTime" />
                                <input type="hidden" defaultValue={Ses.gear} name="Browser" />
                                <input type="hidden" defaultValue={Ses.ip} name="Address" />
                                <input type="hidden" defaultValue={window.location.href} name="Referer" />
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <Box style={{ padding: 0 }}>
                            <Table sx={{ border: 'solid', borderWidth: 1 }} className="error" cellSpacing={0} cellPadding={0} width="20%">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ padding: 0.5 }} colSpan={2}>
                                            {Resources.translate('error.errorBoundary.errorReport')}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {errorDetails.map((err, i) => (
                                        <TableRow key={i} sx={{ border: 'solid', borderWidth: 1 }}>
                                            <TableCell sx={{ border: 'solid', padding: 0.5, borderWidth: 1 }} className="t">
                                                {err.label}
                                            </TableCell>
                                            <TableCell sx={{ border: 'solid', padding: 0.5, borderWidth: 1 }} dangerouslySetInnerHTML={{ __html: `<pre><code>${err.data}</code></pre>` }} style={{ fontSize: 12 }} />
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
