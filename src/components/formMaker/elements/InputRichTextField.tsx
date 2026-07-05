// #region IMPORTS -> /////////////////////////////////////
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TextList from '@tiptap/extension-list-item';
import TextOrderList from '@tiptap/extension-ordered-list';
import TextBulletList from '@tiptap/extension-bullet-list';
import TextAlign from '@tiptap/extension-text-align';
import TextUnderline from '@tiptap/extension-underline';
import TextItalic from '@tiptap/extension-italic';
import TextBold from '@tiptap/extension-bold';
import TextLink from '@tiptap/extension-link';
import TextStrike from '@tiptap/extension-strike';
import TextColor from '@tiptap/extension-color';
import CharacterCount from '@tiptap/extension-character-count';
import History from '@tiptap/extension-history';
import {
    MenuButtonAlignCenter,
    MenuButtonAlignJustify,
    MenuButtonAlignLeft,
    MenuButtonAlignRight,
    MenuButtonBold,
    MenuButtonBulletedList,
    MenuButtonEditLink,
    MenuButtonItalic,
    MenuButtonOrderedList,
    MenuButtonStrikethrough,
    MenuButtonUnderline,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    RichTextEditor,
    LinkBubbleMenuHandler,
    MenuButtonColorPicker,
    LinkBubbleMenu,
    MenuButtonUndo,
    MenuButtonRedo,
} from 'mui-tiptap';
import { useState, useRef, useEffect, lazy, JSX } from 'react';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { Editor } from '@tiptap/core';
import { Transaction } from '@tiptap/pm/state';
import { TextStyle } from '@tiptap/extension-text-style';
import Box from '@mui/material/Box';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputRichTextField({ disabled, id, onChange, value, required, maxLength = 2000 }: IInputRichTextField): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [text, setText] = useState<string>((value as string) ?? '');
    const editorRef = useRef<Editor | null>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleChange = (e: { editor: Editor; transaction: Transaction }): void => {
        const html = e.editor.getHTML();
        const encoded = encodeURIComponent(html);
        if (onChange) {
            onChange(encoded);
        }
        setText(encoded);
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (value !== undefined && value !== text) {
            setText(value as string);
            editorRef.current?.commands.setContent(decodeURIComponent((value as string) ?? ''));
        }
    }, [value]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box className="mt-1">
            <RichTextEditor
                content={decodeURIComponent(text)}
                extensions={[
                    Document.configure({
                        onchange: () => {},
                    }),
                    Paragraph,
                    Text.configure({
                        onChange: () => {},
                    }),
                    TextList,
                    CharacterCount.configure({
                        limit: maxLength,
                    }),
                    TextOrderList,
                    TextBulletList,
                    TextAlign.configure({
                        types: ['paragraph'],
                        defaultAlignment: 'left',
                    }),
                    TextUnderline,
                    LinkBubbleMenuHandler,
                    TextLink.configure({
                        openOnClick: true,
                        autolink: true,
                        linkOnPaste: true,
                        HTMLAttributes: {
                            target: '_blank',
                            rel: 'noopener noreferrer',
                        },
                    }),
                    TextStrike,
                    TextItalic,
                    TextBold,
                    TextColor,
                    TextStyle,
                    History.configure({
                        depth: 100,
                        newGroupDelay: 500,
                    }),
                ]}
                editorProps={{
                    attributes: {
                        required: required ? 'true' : 'false',
                        disabled: disabled ? 'true' : 'false',
                        max: maxLength.toString(),
                    },
                }}
                onCreate={(editor) => {
                    editorRef.current = editor.editor;
                }}
                onUpdate={handleChange}
                renderControls={() => (
                    <MenuControlsContainer>
                        <MenuSelectHeading />
                        <MenuDivider />
                        <MenuButtonBold tooltipLabel="Gras" />
                        <MenuButtonItalic tooltipLabel="Italique" />
                        <MenuButtonUnderline tooltipLabel="Souligné" />
                        <MenuButtonStrikethrough tooltipLabel="Barré" />
                        <MenuDivider />
                        <MenuButtonUndo tooltipLabel="Annuler" />
                        <MenuButtonRedo tooltipLabel="Rétablir" />
                        <MenuDivider />
                        <MenuButtonBulletedList tooltipLabel="Liste à puces" />
                        <MenuButtonOrderedList tooltipLabel="Liste à nombres" />
                        <MenuDivider />
                        <MenuButtonAlignLeft tooltipLabel="Aligné à gauche" />
                        <MenuButtonAlignCenter tooltipLabel="Aligné au centre" />
                        <MenuButtonAlignRight tooltipLabel="Aligné à droite" />
                        <MenuButtonAlignJustify tooltipLabel="Justifier" />
                        <MenuDivider />
                        <MenuButtonEditLink tooltipLabel="Lien" />
                        <MenuButtonColorPicker
                            value=""
                            onChange={(newColor) => {
                                editorRef.current?.chain().focus().setColor(newColor).run();
                            }}
                            tooltipLabel="Couleur"
                            labels={{
                                removeColorButton: 'Reset',
                                saveButton: 'Sauver',
                                cancelButton: 'Fermer',
                            }}
                        >
                            <AppIcon name="Palette" />
                        </MenuButtonColorPicker>
                    </MenuControlsContainer>
                )}
            >
                {() => (
                    <>
                        <LinkBubbleMenu labels={{ editLinkAddTitle: 'Ajouter Lien', editLinkEditTitle: 'Texte', editLinkHrefInputLabel: 'Lien', editLinkCancelButtonLabel: 'Annuler', editLinkSaveButtonLabel: 'Ajouter', editLinkTextInputLabel: 'Texte', viewLinkEditButtonLabel: 'Modifier', viewLinkRemoveButtonLabel: 'Supprimer' }} />
                    </>
                )}
            </RichTextEditor>
            {editorRef.current && (
                <div style={{ textAlign: 'right', fontSize: 12, color: '#888' }}>
                    {editorRef.current.storage.characterCount.characters()}/{maxLength} caractères
                </div>
            )}
            <input type="hidden" value={text ?? ''} id={id} name={id} />
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputRichTextField extends InputBaseType {
    maxLength?: number;
}
// #enderegion IPROPS --> //////////////////////////////////
