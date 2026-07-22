import { JSX, lazy, useEffect, useState } from 'react';
import { GenericActionEnum, ICenterBase } from '~/types/centerType';
import appTool from '~/helpers/appTool';
import useResources from '~/hooks/useResources';
import AppCenterSearch from './AppCenterSearch';
import { Bold, Bolder, Regular } from '../common/Text';
import AppAlert from '../common/AppAlert';
import { LevelAccessEnum } from '~/models/Session';
import useNavigation from '~/hooks/useNavigation';
import { Link } from 'react-router-dom';
import NavigationResource from '~/resources/navigationResources';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Chip, Grid, Paper } from '@mui/material';
import useSessionContext from '~/context/sessionContext';
import ContentLayout from '../layout/ContentLayout';
import useCenterContext from '~/context/centerContext';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
/**
 *
 * @param {ICenterBase} props
 * @returns Center layout
 */
export default function CenterBase(props: ICenterBase): JSX.Element {
    const [isTemplateDisabled, setIsTemplateDisabled] = useState<boolean>(false);
    const { state } = useCenterContext();
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
        <ContentLayout
            title={buildTitle()}
            icon={props.icon}
            actions={
                state.config.overrideLayoutAction ? (
                    <state.config.overrideLayoutAction data={state.datas} action={props.action} />
                ) : props.action === GenericActionEnum.TABLE ? (
                    <DBCount {...props} />
                ) : null
            }
        >
            {props.action === GenericActionEnum.TABLE && <Filters {...props} />}
            <AppAlert
                onClose={props.onCloseAlert}
                isVisible={props.isAlertVisible}
                severity={props.alertContent?.severity ?? 'error'}
                title={props.alertContent?.title ?? ''}
                subtitle={props.alertContent?.subtitle ?? ''}
            />
            {props.children}
            {props.action === GenericActionEnum.VIEW && <SubmitSubFooter />}
        </ContentLayout>
    );
}

function DBCount(props: ICenterBase): JSX.Element {
    const { translate } = useResources();
    return (
        <Paper variant="outlined" className="rounded px-3 py-2 d-flex flex-column" sx={{ minWidth: '180px', gap: '0.05rem' }}>
            {/* <Regular component="span" fontSize="0.76rem">
                {translate('center.search.updateSearch')}
            </Regular> */}
            <Bolder sx={{ lineHeight: 1 }} variant="h5">
                {props.totalDbCount}
            </Bolder>
            <Regular component="span" fontSize="0.76rem">
                {translate('center.search.ref', {
                    entity: props.grammar[props.totalDbCount > 1 ? 'plural' : 'singular'].toLowerCase(),
                    fem: props.grammar.isFem ? 'e' : '',
                    plural: props.totalDbCount > 1 ? 's' : '',
                })}
            </Regular>
        </Paper>
    );
}

function Filters(props: ICenterBase): JSX.Element {
    return (
        <Box marginBottom={0}>
            <Box display={'flex'} marginBottom={{ xs: 1, md: 0 }} flexWrap={'wrap'} justifyContent={'space-between'}>
                <AppCenterSearch grammar={props.grammar} onSubmitSearchForm={props.onSubmitSearchForm} searchFormStruct={props.searchForm} />
            </Box>
            <FilterFooter {...props} />
        </Box>
    );
}

function FilterFooter(props: ICenterBase): JSX.Element {
    const { levelNew = LevelAccessEnum.ADMIN } = props;
    const { translate } = useResources();
    const { accessLevel } = useSessionContext();
    return (
        <Grid container component={Box}>
            <Grid component={Box} size={3} className="d-flex align-items-center">
                {levelNew >= LevelAccessEnum.VISITOR && levelNew <= accessLevel && (
                    <Box className="d-flex align-items-center justify-content-center">
                        <Button variant="outlined" startIcon={<AppIcon name="AddRounded" />} component={Link} to={`${props.basePath ?? `${NavigationResource.routesPath.center}/${props.entity}`}/new`}>
                            {translate('common.add')} {props.grammar?.singular.toLowerCase()}
                        </Button>
                    </Box>
                )}
            </Grid>
            <Grid size={7} component={Box} />
            <Grid size={2} component={Box} className="d-flex align-items-center justify-content-end">
                <Chip
                    label={
                        <Bold>
                            <b>{props.totalCount}</b> {props.totalCount > 1 ? (props.grammar?.plural ?? '') : (props.grammar?.singular ?? '')}
                        </Bold>
                    }
                />
            </Grid>
        </Grid>
    );
}

function SubmitSubFooter(): JSX.Element {
    const { goBack } = useNavigation();
    const { translate } = useResources();
    return (
        <Box display="flex" justifyContent="center">
            <Button variant="contained" className="ms-3" color="secondary" onClick={() => goBack()}>
                {translate('common.back')}
            </Button>
        </Box>
    );
}
