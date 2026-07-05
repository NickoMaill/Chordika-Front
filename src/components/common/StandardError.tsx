import { lazy, useState } from 'react';
import { Regular } from '~/components/common/Text';
import { ApiErrorType } from '~/models/Error';
import useResources from '~/hooks/useResources';
import '~/styles/ErrorBondaryStyles.scss';
import HTMLParser from './HTMLParser';
import stylesResources from '~/resources/stylesResources';
import { JSX } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import useSessionContext from '~/context/sessionContext';
// import useModal from '~/hooks/useModal';

const InputTextAreaField = lazy(() => import('~/components/formMaker/elements/InputTextAreaField'));

export default function StandardError({ error }: IStandardError): JSX.Element {
    const [_isLoading, _setIsLoading] = useState<boolean>(false);

    const { ip, gear, email } = useSessionContext();
    const { translate } = useResources();
    // const Modal = useModal();

    const errorDetails = [
        { label: translate('error.errorBoundary.diag'), data: error.message },
        { label: translate('error.errorBoundary.source'), data: error.stack },
        { label: translate('error.errorBoundary.page'), data: window.location.href },
        { label: translate('error.errorBoundary.clockDate'), data: dayjs().format('DD/MM/YYYY - HH:mm:ss') },
        { label: translate('error.errorBoundary.browser'), data: gear },
        { label: translate('error.errorBoundary.address'), data: ip },
        { label: translate('error.errorBoundary.linkForward'), data: error.targetUrl },
    ];

    return (
        <>
            <Box className="errortext" sx={{ backgroundColor: stylesResources.theme.palette.grey[300], borderRadius: 1 }} minWidth="500px" width="100%">
                <Box>
                    <Box className="errortext w-100 d-flex flex-column align-items-center justify-content-center pt-3">
                        <Box className="w-75" component="form" action="SQLError.aspx" method="post">
                            <Regular fontSize={13} textAlign={'center'}>
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
                                <Regular fontSize={13} fontWeight={'bold'} component={'span'} color={'#E00'}>
                                    {translate('error.errorBoundary.pleaseSend')}
                                </Regular>{' '}
                                {translate('error.errorBoundary.thenClick')} "<b>{translate('common.sendMessage')}</b>"
                                <br />
                            </Regular>
                            <InputTextAreaField sx={{ width: '100%' }} showLabel={false} rows={5} id="Body" label="message" />
                            <br />
                            <input type="hidden" defaultValue={email} name="From" />
                            <Box display="flex" alignItems="center" justifyContent="center" marginBottom={1}>
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
                            <input type="hidden" defaultValue={error.message} name="Diagnostic" />
                            <input type="hidden" defaultValue={error.stack} name="Source" />
                            <input type="hidden" defaultValue={error.stack} name="TableRowace" />
                            <input type="hidden" defaultValue={window.location.href} name="Page" />
                            <input type="hidden" defaultValue={dayjs().format('DD MMMM YYYY HH:mm:ss')} name="DateTime" />
                            <input type="hidden" defaultValue={gear} name="Browser" />
                            <input type="hidden" defaultValue={ip} name="Address" />
                            <input type="hidden" defaultValue={window.location.href} name="Referer" />
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <Box style={{ padding: 0 }}>
                        <Table sx={{ border: 'solid', borderWidth: 1 }} className={'error'} cellSpacing={0} cellPadding={0} width="20%">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ padding: 0.5 }} colSpan={2}>
                                        {translate('error.errorBoundary.errorReport')}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {errorDetails.map((err, i) => (
                                    <TableRow key={i} sx={{ border: 'solid', borderWidth: 1 }}>
                                        <TableCell sx={{ border: 'solid', padding: 0.5, borderWidth: 1 }} className="t">
                                            {err.label}
                                        </TableCell>
                                        <TableCell sx={{ border: 'solid', padding: 0.5, borderWidth: 1 }} style={{ fontSize: 12 }}>
                                            <HTMLParser>{(err.data ?? '').replace('\n', '<br/>')}</HTMLParser>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

interface IStandardError {
    error: ApiErrorType;
}
