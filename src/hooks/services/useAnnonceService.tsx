// #region IMPORTS -> /////////////////////////////////////
import useService from '~/hooks/useService';
import useServiceBase from '../useServiceBase';
import { AnnonceApiModel } from '~/models/Annonce';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useAnnonceService(): IUseAnnonceService {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Service = useService();
    const { asServicePromise } = useServiceBase();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const show = async (): Promise<AnnonceApiModel> => {
        const req = await asServicePromise<AnnonceApiModel[]>(() => Service.get('annonces/show'));
        if (req && req.length > 0) {
            return req[0];
        } else {
            return null;
        }
    };

    const seen = async (id: string): Promise<void> => {
        await asServicePromise(() => Service.post(`annonces/seen/${id}`));
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return { show, seen };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseAnnonceService {
    show: () => Promise<AnnonceApiModel>;
    seen: (id: string) => Promise<void>;
}
// #enderegion IPROPS --> //////////////////////////////////
