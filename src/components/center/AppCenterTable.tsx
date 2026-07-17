// #region IMPORTS -> /////////////////////////////////////
import CenterBase from './CenterBase';
import { BulkTypeEnum, CenterGrammarType, GenericActionEnum, ICenterBase } from '~/types/centerType';
import AppTable, { IAppTable } from '../common/AppTable';
import useResources from '~/hooks/useResources';
import { MutableRefObject, useCallback, useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { Trans } from 'react-i18next';
import AppAlert from '../common/AppAlert';
import InputImportFile from '../formMaker/elements/InputImportFIle';
import { FormMakerFocusErrorType, FormMakerPartEnum, FormMakerType } from '~/types/FormMakerCoreTypes';
import useCenterContext from '~/context/centerContext';
import FormMaker from '../formMaker/FormMaker';
import { JSX } from 'react';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { Grid } from '@mui/material';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function AppCenterTable<T>({ baseProps, tableProps, handleMiniAction, isMini, allowMiniAdd, formRef, data }: IAppCenterTable<T>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [formKey, setFormKey] = useState<number>(0);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { translate } = useResources();
    const { state, dispatch } = useCenterContext();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const isView = (): boolean => {
        return state.miniTableAction === GenericActionEnum.VIEW || state.miniTableAction === GenericActionEnum.DELETE;
    };

    const getActionLabel = useCallback((): string => {
        switch (state.miniTableAction) {
            case GenericActionEnum.UPDATE:
                return translate('common.update') as string;
            case GenericActionEnum.NEW:
                return translate('common.add') as string;
            case GenericActionEnum.DELETE:
                return translate('common.delete') as string;
            default:
                return '';
        }
    }, [state.miniTableAction]);
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (!state.miniFormModal) {
            dispatch({ type: 'SET_MINI_TABLE_ACTION', payload: GenericActionEnum.TABLE });
            setFormKey((prev) => prev + 1);
        }
    }, [state.miniFormModal]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    if (isMini) {
        return (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <AppAlert
                    closable
                    onClose={() => baseProps.onCloseAlert()}
                    isVisible={baseProps.isAlertVisible}
                    severity={baseProps.alertContent?.severity ?? 'error'}
                    title={baseProps.alertContent?.title ?? ''}
                    subtitle={baseProps.alertContent?.subtitle ?? ''}
                />
                <AppTable {...tableProps} isMini />
                {allowMiniAdd && (
                    <Box className="d-flex justify-content-center p-3">
                        <Link className="cursor-pointer" fontWeight={'bold'} onClick={() => handleMiniAction(GenericActionEnum.NEW)} component="a">
                            {translate('common.add')} {baseProps.grammar.singular.toLowerCase()}
                        </Link>
                    </Box>
                )}
                <Modal
                    isOpen={baseProps.miniFormModal}
                    isModalActionLoading={baseProps.isSubmitLoading}
                    modalAction={() => baseProps.onMiniFormSubmit(state.miniTableAction)}
                    onClose={baseProps.onCloseMiniModal}
                    modalActionLabel={getActionLabel()}
                    modalTitle={state.miniFormModalOptions.title}
                    dismissLabel={translate('common.dismiss') as string}
                    closable
                >
                    {baseProps.miniFormLoading ? (
                        <Box className="d-flex justify-content-center my-3">
                            <CircularProgress size={50} />
                        </Box>
                    ) : (
                        <FormMaker<T>
                            key={formKey}
                            structure={state.config.formTemplate}
                            isView={isView()}
                            formRef={formRef}
                            showBottom={false}
                            onSubmit={() => null}
                            data={state.miniTableAction !== GenericActionEnum.NEW ? data : null}
                            recordId={(data as { id?: string | number })?.id?.toString()}
                            action={state.miniTableAction}
                        />
                    )}
                </Modal>
            </Box>
        );
    } else {
        return (
            <CenterBase {...baseProps}>
                <Grid container component={'section'} spacing={2}>
                    <Grid size={state.config.tableStructure.SideComponent ? { xl: 9, lg: 8, md: 12, xs: 12 } : 12} component={'article'}>
                        {state.config.tableStructure.OverrideComponent ? (
                            <state.config.tableStructure.OverrideComponent key={6} baseProps={baseProps} tableProps={tableProps as IAppTable<unknown>} />
                        ) : (
                            <AppTable {...tableProps} />
                        )}
                    </Grid>
                    {state.config.tableStructure.SideComponent && (
                        <Grid component={'aside'} size={{ xl: 3, lg: 4, md: 12, xs: 12 }}>
                            <state.config.tableStructure.SideComponent />
                        </Grid>
                    )}
                </Grid>
                <AppBulkModal
                    isOpen={baseProps.isBulkModalOpen}
                    bulkType={baseProps.bulkType}
                    isLoading={baseProps.isBulkTemplateLoading}
                    bulkMessage={baseProps.bulkMessage}
                    isAlertVisible={baseProps.isBulkAlertVisible}
                    onClose={baseProps.onCloseBulkModal}
                    onSend={baseProps.onBulkSend}
                    onTemplateClick={baseProps.onBulkTemplateClick}
                    onCloseAlert={baseProps.onCloseBulkAlert}
                    grammar={baseProps.grammar}
                />
            </CenterBase>
        );
    }

    // #endregion RENDER --> ///////////////////////////////////
}

function AppBulkModal(props: BulkModalProps): JSX.Element {
    const [bulkValue, setBulkValue] = useState<File[]>(null);
    const { translate } = useResources();

    return (
        <Modal
            modalAction={() => props.onSend(bulkValue, props.bulkType)}
            onClose={props.onClose}
            modalActionLabel={(props.bulkType === BulkTypeEnum.ADD ? translate('common.add') : translate('common.update')) as string}
            modalTitle={
                translate('center.bulk.bulkTitle', {
                    grammar: props.grammar.plural,
                    action: (props.bulkType === BulkTypeEnum.ADD ? translate('common.add') : translate('common.update')) as string,
                }) as string
            }
            isOpen={props.isOpen}
            dismissLabel={translate('common.close') as string}
        >
            <Box marginBottom={2}>
                <Trans
                    i18nKey="center.bulk.bulkAddMessage"
                    values={{ grammar: props.grammar.plural, action: props.bulkType === BulkTypeEnum.ADD ? translate('common.youAdd') : translate('common.youUpdate') }}
                />
                <Divider sx={{ marginBlock: 3 }} />
                <Button loading={props.isLoading} size="large" disabled={false} onClick={props.onTemplateClick} variant="outlined">
                    {translate('center.bulk.downloadTemplate')}
                </Button>
            </Box>
            <AppAlert title={props.bulkMessage} onClose={props.onCloseAlert} severity="error" isVisible={props.isAlertVisible} />
            <InputImportFile
                onChange={(e) => setBulkValue(e)}
                dropzoneText={translate('center.bulk.importXlsx') as string}
                typeFile={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
                filesLimit={4}
            />
        </Modal>
    );
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppCenterTable<T> {
    baseProps?: ICenterBase;
    tableProps: IAppTable<T>;
    formMakerBaseProps?: {
        focusOnError: FormMakerFocusErrorType[];
        isSubmitLoading: boolean;
        structure: FormMakerType<FormMakerPartEnum>;
        action: GenericActionEnum;
        grammar: string;
    };
    handleMiniAction?: (action: GenericActionEnum, id?: string) => void;
    isMini?: boolean;
    allowMiniAdd?: boolean;
    allowMiniUpdate?: boolean;
    allowMiniDelete?: boolean;
    data?: T;
    formRef?: MutableRefObject<HTMLFormElement>;
}

interface BulkModalProps {
    isOpen: boolean;
    bulkType: BulkTypeEnum;
    isLoading: boolean;
    bulkMessage: string;
    isAlertVisible: boolean;
    onClose: () => void;
    onSend: (files: File[], type: BulkTypeEnum) => void;
    onTemplateClick: () => void;
    onCloseAlert: () => void;
    grammar: CenterGrammarType;
}
// #enderegion IPROPS --> //////////////////////////////////
