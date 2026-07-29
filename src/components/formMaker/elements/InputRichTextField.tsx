// #region IMPORTS -> /////////////////////////////////////
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
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
    RichTextEditorRef,
} from 'mui-tiptap';
import { useState, useRef, useEffect, lazy, JSX } from 'react';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { Editor } from '@tiptap/core';
import { Transaction } from '@tiptap/pm/state';
import { TextStyle } from '@tiptap/extension-text-style';
import Box from '@mui/material/Box';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

export default function InputRichTextField({ disabled, id, onChange, value, required, maxLength = 2000, rows = 100 }: IInputRichTextField): JSX.Element {
    const [text, setText] = useState<string>((value as string) ?? '');
    const [editor, setEditor] = useState<Editor | null>(null);
    const richTextEditorRef = useRef<RichTextEditorRef>(null);

    const handleChange = (e: { editor: Editor; transaction: Transaction }): void => {
        const html = e.editor.getHTML();
        const encoded = encodeURIComponent(html);
        setText(encoded);
        if (onChange) {
            onChange(encoded);
        }
    };

    useEffect(() => {
        setEditor(richTextEditorRef.current?.editor ?? null);
    }, []);

    useEffect(() => {
        if (value === undefined) {
            return;
        }

        const nextValue = (value as string) ?? '';

        setText((currentText) => (currentText === nextValue ? currentText : nextValue));

        if (editor) {
            const decodedValue = decodeURIComponent(nextValue);

            if (editor.getHTML() !== decodedValue) {
                editor.commands.setContent(decodedValue, { emitUpdate: false });
            }
        }
    }, [value, editor]);

    return (
        <Box className="mt-1">
            <RichTextEditor
                ref={richTextEditorRef}
                content={decodeURIComponent(text)}
                sx={{
                    '& .MuiTiptap-RichTextContent-root': {
                        bgcolor: 'background.default',
                    },
                    '& .ProseMirror': {
                        minHeight: rows,
                    },
                }}
                extensions={[
                    Document.configure({
                        onchange: () => {},
                    }),
                    Paragraph,
                    Heading,
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
                onUpdate={handleChange}
                renderControls={() => (
                    <MenuControlsContainer>
                        <MenuSelectHeading />
                        <MenuDivider />
                        <MenuButtonBold tooltipLabel="Gras" />
                        <MenuButtonItalic tooltipLabel="Italique" />
                        <MenuButtonUnderline tooltipLabel="Souligne" />
                        <MenuButtonStrikethrough tooltipLabel="Barre" />
                        <MenuDivider />
                        <MenuButtonUndo tooltipLabel="Annuler" />
                        <MenuButtonRedo tooltipLabel="Retablir" />
                        <MenuDivider />
                        <MenuButtonBulletedList tooltipLabel="Liste a puces" />
                        <MenuButtonOrderedList tooltipLabel="Liste a nombres" />
                        <MenuDivider />
                        <MenuButtonAlignLeft tooltipLabel="Aligne a gauche" />
                        <MenuButtonAlignCenter tooltipLabel="Aligne au centre" />
                        <MenuButtonAlignRight tooltipLabel="Aligne a droite" />
                        <MenuButtonAlignJustify tooltipLabel="Justifier" />
                        <MenuDivider />
                        <MenuButtonEditLink tooltipLabel="Lien" />
                        <MenuButtonColorPicker
                            value=""
                            onChange={(newColor) => {
                                editor?.chain().focus().setColor(newColor).run();
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
                    <LinkBubbleMenu
                        labels={{
                            editLinkAddTitle: 'Ajouter Lien',
                            editLinkEditTitle: 'Texte',
                            editLinkHrefInputLabel: 'Lien',
                            editLinkCancelButtonLabel: 'Annuler',
                            editLinkSaveButtonLabel: 'Ajouter',
                            editLinkTextInputLabel: 'Texte',
                            viewLinkEditButtonLabel: 'Modifier',
                            viewLinkRemoveButtonLabel: 'Supprimer',
                        }}
                    />
                )}
            </RichTextEditor>
            {editor && (
                <div style={{ textAlign: 'right', fontSize: 12, color: '#888' }}>
                    {editor.storage.characterCount.characters()}/{maxLength} caracteres
                </div>
            )}
            <input type="hidden" value={text ?? ''} id={id} name={id} readOnly />
        </Box>
    );
}

interface IInputRichTextField extends InputBaseType {
    maxLength?: number;
    rows?: number;
}
