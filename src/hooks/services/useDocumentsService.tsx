// #region IMPORTS -> /////////////////////////////////////
import { AppError } from '~/core/appError';
import useService from '../useService';
import useServiceBase from '../useServiceBase';
import useToast from '../useToast';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useDocumentsService(): IUseDocumentsService {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Service = useService();
    const { asServicePromise } = useServiceBase();
    const Toast = useToast();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const downloadFile = async (id: number): Promise<void> => {
        await asServicePromise(() => Service.downloadFile(`documents/download/${id}`)).catch((err: AppError) => {
            switch (err.code) {
                case 'doc_not_found':
                    Toast.warning('Document non trouvé dans la base...');
                    break;
                default:
                    Toast.error(err.message);
                    break;
            }
        });
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return {
        downloadFile,
    };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseDocumentsService {
    downloadFile: (id: number) => Promise<void>;
}
// #enderegion IPROPS --> //////////////////////////////////
