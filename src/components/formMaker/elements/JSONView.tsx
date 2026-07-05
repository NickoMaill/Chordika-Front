// #region IMPORTS -> /////////////////////////////////////
import HTMLParser from '~/components/common/HTMLParser';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { JSX } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function JSONView({ value }: IJSONView): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const syntaxHighlight = (json: string): string => {
        return json.replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return `<span class="JSON-${cls}">${match}</span>`;
        });
    };
    const formattedJSON = (value ?? '') !== '' ? syntaxHighlight(JSON.stringify(JSON.parse(value as string), null, 4)) : '-';
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <pre
            style={{
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                padding: '10px',
                borderRadius: '6px',
                overflowX: 'auto',
            }}
        >
            <code>
                <HTMLParser>{formattedJSON}</HTMLParser>
            </code>
        </pre>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IJSONView extends InputBaseType {}
// #enderegion IPROPS --> //////////////////////////////////
