// #region IMPORTS -> /////////////////////////////////////
import { JSX, useMemo } from 'react';
import FormMaker, { FormMakerChange } from '~/components/formMaker/FormMaker';
import { ScoreBarContent } from '~/models/Score';
import { FormMakerPartEnum, FormMakerType, GroupedSelectOptionType } from '~/types/FormMakerCoreTypes';
import { MusicSymbol } from '~/types/musicSymbol';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorChordForm({ data, onChange }: IEditorChordForm): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const options: GroupedSelectOptionType[] = [
        {
            label: 'Silences',
            options: [
                { label: `++<span style="fontFamily: Bravura; fontSize: 2rem;" class="me-2">${MusicSymbol.restWholeLegerLine}</span> Pause`, value: 'restWholeLegerLine' },
                { label: `++<span style="fontFamily: Bravura; fontSize: 2rem;" class="me-2">${MusicSymbol.restHalfLegerLine}</span> Demi-pause`, value: 'restHalfLegerLine' },
                { label: `++<span style="fontFamily: Bravura; fontSize: 2rem;" class="me-2">${MusicSymbol.restQuarter}</span> Soupir`, value: 'restQuarter' },
                { label: `++<span style="fontFamily: Bravura; fontSize: 2rem;" class="me-2">${MusicSymbol.rest8th}</span> Demi-soupir`, value: 'rest8th' },
            ],
        },
        {
            label: 'Répétition',
            options: [{ label: `++<span style="fontFamily: Bravura; fontSize: 2rem" class="me-2">${MusicSymbol.repeat1Bar}</span> Répétition d'une mesure`, value: 'repeat1Bar' }],
        },
    ];
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const struct = useMemo<FormMakerType<FormMakerPartEnum.SEARCH>>(
        () => [
            {
                title: '',
                type: FormMakerPartEnum.SEARCH,
                content: [
                    {
                        id: 'chordName',
                        label: 'Accord',
                        type: 'text',
                        index: 1,
                        size: 12,
                        value: data?.chordName
                    },
                    {
                        id: 'symbol',
                        label: 'Symboles',
                        type: 'groupedSelect',
                        index: 1,
                        size: 12,
                        groupedSelectOptions: options,
                        value: data?.symbols
                    },
                ],
            },
        ],
        [data]
    );
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return <FormMaker structure={struct} onChange={onChange} showBottom={false} />;
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditorChordForm {
    data: ScoreBarContent;
    onChange?: (e: FormMakerChange) => void;
}
// #enderegion IPROPS --> //////////////////////////////////
