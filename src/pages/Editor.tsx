// #region IMPORTS -> /////////////////////////////////////
import { JSX } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import EditorMain from '~/components/editor/EditorMain';
import EditorProvider from '~/context/EditorProvider';
import NotFound from './NotFound';
import { Regular } from '~/components/common/Text';
import EditorAddForm from '~/components/editor/EditorAddForm';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function Editor(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const { scoreId } = useParams();
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    if (scoreId) {
        return (
            <EditorProvider>
                <EditorMain id={Number(scoreId)} />
            </EditorProvider>
        );
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
