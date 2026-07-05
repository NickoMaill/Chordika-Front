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
import { FormMakerContentType, FormMakerPartEnum } from '~/types/FormMakerCoreTypes';
import useCenterContext from '~/context/centerContext';
import FormMaker from '../formMaker/FormMaker';
import { JSX } from 'react';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function AppCenterTable<T>({ baseProps, tableProps, handleMiniAction, isMini, allowMiniAdd, formRef, data }: IAppCenterTable<T>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [formKey, setFormKey] = useState<number>(0);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Resources = useResources();
    const Ctx = useCenterContext();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const isView = (): boolean => {
        return Ctx.state.miniTableAction === GenericActionEnum.VIEW || Ctx.state.miniTableAction === GenericActionEnum.DELETE;
    };

    const getActionLabel = useCallback((): string => {
        switch (Ctx.state.miniTableAction) {
            case GenericActionEnum.UPDATE:
                return Resources.translate('common.update') as string;
            case GenericActionEnum.NEW:
                return Resources.translate('common.add') as string;
            case GenericActionEnum.DELETE:
                return Resources.translate('common.delete') as string;
            default:
                return '';
        }
    }, [Ctx.state.miniTableAction]);
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (!Ctx.state.miniFormModal) {
            Ctx.dispatch({ type: 'SET_MINI_TABLE_ACTION', payload: GenericActionEnum.TABLE });
            setFormKey((prev) => prev++);
        }
    }, [Ctx.state.miniFormModal]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    if (isMini) {
        return (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <AppAlert closable onClose={() => baseProps.onCloseAlert()} isVisible={baseProps.isAlertVisible} severity={baseProps.alertContent?.severity ?? 'error'} title={baseProps.alertContent?.title ?? ''} subtitle={baseProps.alertContent?.subtitle ?? ''} />
                <AppTable {...tableProps} isMini />
                {allowMiniAdd && (
                    <Box className="d-flex justify-content-center p-3">
                        <Link className="cursor-pointer" fontWeight={'bold'} onClick={() => handleMiniAction(GenericActionEnum.NEW)} component="a">
                            {Resources.translate('common.add')} {baseProps.grammar.singular.toLowerCase()}
                        </Link>
                    </Box>
                )}
                <Modal isOpen={baseProps.miniFormModal} isModalActionLoading={baseProps.isSubmitLoading} modalAction={() => baseProps.onMiniFormSubmit(Ctx.state.miniTableAction)} onClose={baseProps.onCloseMiniModal} modalActionLabel={getActionLabel()} modalTitle={Ctx.state.miniFormModalOptions.title} dismissLabel={Resources.translate('common.dismiss') as string} closable>
                    {baseProps.miniFormLoading ? (
                        <Box className="d-flex justify-content-center my-3">
                            <CircularProgress size={50} />
                        </Box>
                    ) : (
                        <FormMaker<T> key={formKey} structure={Ctx.state.config.formTemplate} isView={isView()} formRef={formRef} showBottom={false} onSubmit={() => null} data={Ctx.state.miniTableAction !== GenericActionEnum.NEW ? data : null} action={Ctx.state.miniTableAction} />
                    )}
                </Modal>
            </Box>
        );
    } else {
        return (
            <CenterBase {...baseProps}>
                <AppTable {...tableProps} />
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
    const Resources = useResources();

    return (
        <Modal
            modalAction={() => props.onSend(bulkValue, props.bulkType)}
            onClose={props.onClose}
            modalActionLabel={(props.bulkType === BulkTypeEnum.ADD ? Resources.translate('common.add') : Resources.translate('common.update')) as string}
            modalTitle={Resources.translate('center.bulk.bulkTitle', { grammar: props.grammar.plural, action: (props.bulkType === BulkTypeEnum.ADD ? Resources.translate('common.add') : Resources.translate('common.update')) as string }) as string}
            isOpen={props.isOpen}
            dismissLabel={Resources.translate('common.close') as string}
        >
            <Box marginBottom={2}>
                <Trans i18nKey="center.bulk.bulkAddMessage" values={{ grammar: props.grammar.plural, action: props.bulkType === BulkTypeEnum.ADD ? Resources.translate('common.youAdd') : Resources.translate('common.youUpdate') }} />
                <Divider sx={{ marginBlock: 3 }} />
                <Button loading={props.isLoading} size="large" disabled={false} onClick={props.onTemplateClick} variant="outlined">
                    {Resources.translate('center.bulk.downloadTemplate')}
                </Button>
            </Box>
            <AppAlert title={props.bulkMessage} onClose={props.onCloseAlert} severity="error" isVisible={props.isAlertVisible} />
            <InputImportFile onChange={(e) => setBulkValue(e)} dropzoneText={Resources.translate('center.bulk.importXlsx') as string} typeFile={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']} filesLimit={4} />
        </Modal>
    );
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppCenterTable<T> {
    baseProps?: ICenterBase;
    tableProps: IAppTable<T>;
    formMakerBaseProps?: {
        focusOnError: string[];
        isSubmitLoading: boolean;
        structure: FormMakerContentType<FormMakerPartEnum>[];
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
