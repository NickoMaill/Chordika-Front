import { JSX, lazy, useContext, useEffect, useState } from 'react';
import SessionContext from '~/context/sessionContext';
import { GenericActionEnum, ICenterBase } from '~/types/centerType';
import appTool from '~/helpers/appTool';
import useResources from '~/hooks/useResources';
import stylesResources from '~/resources/stylesResources';
import AppCenterSearch from './AppCenterSearch';
import { Bold } from '../common/Text';
import AppAlert from '../common/AppAlert';
import { LevelAccessEnum } from '~/models/Session';
import useNavigation from '~/hooks/useNavigation';
import { Link } from 'react-router-dom';
import NavigationResource from '~/resources/navigationResources';
import MuiLink from '@mui/material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
/**
 *
 * @param {ICenterBase} props
 * @returns Center layout
 */
export default function CenterBase(props: ICenterBase): JSX.Element {
    const { levelNew = LevelAccessEnum.ADMIN } = props;
    const [isTemplateDisabled, setIsTemplateDisabled] = useState<boolean>(false);

    const Resources = useResources();
    const Ses = useContext(SessionContext);

    const buildTitle = (): string => {
        switch (props.action) {
            case GenericActionEnum.UPDATE:
            case GenericActionEnum.DELETE:
                return `${props.prefix && props.prefix + ' '}${props.grammar?.singular ?? ''} ID ${props.id}`;
            case GenericActionEnum.NEW:
                return `${props.prefix && props.prefix + ' '}${props.grammar?.singular ?? ''}`;
            default:
                return `${props.grammar?.plural}`;
        }
    };

    useEffect(() => {
        if (props.action === GenericActionEnum.TABLE) {
            appTool.changeTitle(props.grammar?.plural ?? '');
        } else {
            appTool.changeTitle(props.prefix ? props.prefix + ' ' + (props.grammar?.singular ?? '') : (props.grammar?.singular ?? ''));
        }
    }, []);

    useEffect(() => {
        if (isTemplateDisabled) {
            setTimeout(() => {
                setIsTemplateDisabled(false);
            }, 2000);
        }
    }, [isTemplateDisabled]);

    return (
        <Box>
            <Box display="flex" alignItems="center" className="mb-2">
                {props.icon && <AppIcon name={props.icon} sx={{ fontSize: '3.3rem' }} className="me-2" color="primary" />}
                <Typography variant="h3" color={stylesResources.theme.palette.primary.main} component="h2">
                    {buildTitle()}
                </Typography>
            </Box>
            {props.action === GenericActionEnum.TABLE && (
                <Box marginBottom={1}>
                    <Box display={'flex'} marginBottom={{ xs: 1, md: 0 }} flexWrap={'wrap'} justifyContent={'space-between'}>
                        <AppCenterSearch grammar={props.grammar} onSubmitSearchForm={props.onSubmitSearchForm} searchFormStruct={props.searchForm} />
                    </Box>
                    {levelNew >= LevelAccessEnum.VISITOR && levelNew <= Ses.accessLevel && (
                        <Box className="d-flex align-items-center justify-content-center">
                            <MuiLink component={Link} to={`${NavigationResource.routesPath.center}/${props.entity}/new`}>
                                <Bold>
                                    {Resources.translate('common.add')} {props.grammar?.singular.toLowerCase()}
                                </Bold>
                            </MuiLink>
                        </Box>
                    )}
                    <Typography>
                        <b>{props.totalCount}</b> {props.totalCount > 1 ? (props.grammar?.plural ?? '') : (props.grammar?.singular ?? '')}
                    </Typography>
                </Box>
            )}
            <Divider className="mb-2" />
            <AppAlert onClose={props.onCloseAlert} isVisible={props.isAlertVisible} severity={props.alertContent?.severity ?? 'error'} title={props.alertContent?.title ?? ''} subtitle={props.alertContent?.subtitle ?? ''} />
            <Box>
                <>
                    {/* <AppFullPageLoader isLoading={props.isSearchLoading} message={`Recherche ${props.prefix.endsWith("'") ? props.prefix : props.prefix + ' '}${(props.grammar?.plural ?? '').toLocaleLowerCase()} en cours...`} /> */}
                    {props.children}
                </>
            </Box>
            {props.action === GenericActionEnum.VIEW && <SubmitSubFooter />}
        </Box>
    );
}

function SubmitSubFooter(): JSX.Element {
    const navigation = useNavigation();
    const Resources = useResources();
    return (
        <Box display="flex" justifyContent="center">
            <Button variant="contained" className="ms-3" color="secondary" onClick={() => navigation.goBack()}>
                {Resources.translate('common.back')}
            </Button>
        </Box>
    );
}
