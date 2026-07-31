// #region IMPORTS -> /////////////////////////////////////
import { JSX, useEffect, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import EditorMain from '~/components/editor/EditorMain';
import EditorProvider from '~/context/EditorProvider';
import NotFound from './NotFound';
import { Regular } from '~/components/common/Text';
import EditorAddForm from '~/components/editor/forms/EditorAddForm';
import useNavigation from '~/hooks/useNavigation';
import useAppContext from '~/context/appContext';
import useSessionService from '~/hooks/services/useSessionService';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function Editor(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [searchParams] = useSearchParams();
    const [isChecking, setIsChecking] = useState<boolean>(true);
    const [isPrintMode, setIsPrintMode] = useState(false);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { scoreId } = useParams();
    const { pathname } = useNavigation();
    const { setIsNoAccess } = useAppContext();
    const { checkPrintToken } = useSessionService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const checkPrint = (): void => {
        if (!pathname.endsWith('/print')) {
            setIsChecking(false);
            return;
        }
        if (!searchParams.has('printToken') || !scoreId) {
            setIsNoAccess(true);
            return;
        }
        setIsPrintMode(true);
        const token = searchParams.get('printToken');
        checkPrintToken(token, scoreId).then((res) => {
            if (res.success) {
                setIsChecking(false);
            } else {
                setIsNoAccess(true);
            }
        });
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        checkPrint();
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    if (scoreId) {
        if (isChecking) {
            return <></>;
        } else {
            return (
                <EditorProvider>
                    <EditorMain isPrintMode={isPrintMode} scoreId={Number(scoreId)} />
                </EditorProvider>
            );
        }
    } else {
        return <EditorInit />;
    }
    // #endregion RENDER --> ///////////////////////////////////
}

function EditorInit(): JSX.Element {
    const { pathname } = useLocation();
    if (pathname.endsWith('/add')) {
        return <EditorAddForm />;
    } else if (pathname.endsWith('/import')) {
        return <Regular>Importer</Regular>;
    } else {
        return <NotFound />;
    }
}
// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
