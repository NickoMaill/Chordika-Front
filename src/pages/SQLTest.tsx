// #region IMPORTS -> /////////////////////////////////////
import { JSX } from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';
import { Bold, Regular } from '~/components/common/Text';
import FormMaker from '~/components/formMaker/FormMaker';
import ContentLayout from '~/components/layout/ContentLayout';
import { SQLTestOutput } from '~/models/Common';
import { FormMakerType, FormMakerPartEnum } from '~/types/FormMakerCoreTypes';
import useToolService from '~/hooks/services/useToolService';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function SQLTest(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<SQLTestOutput[]>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Tools = useToolService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const getStruct = (): FormMakerType<FormMakerPartEnum.PANEL> => {
        const struct: FormMakerType<FormMakerPartEnum.PANEL> = [
            {
                title: 'Éxecution SQL',
                type: FormMakerPartEnum.PANEL,
                content: [
                    {
                        type: 'textarea',
                        size: 12,
                        id: 'sqlStr',
                        index: 1,
                        label: 'Requête SQL',
                    },
                    {
                        type: 'text',
                        id: 'columns',
                        index: 1,
                        size: 12,
                        label: 'Colonnes',
                        value: result && result.length > 0 ? result[result.length - 1].columns.join(',') : null,
                    },
                ],
            },
        ];
        return struct;
    };

    const onSubmit = (e: FormData): void => {
        setIsLoading(true);
        setResult(null);
        Tools.getSqlTest(e)
            .then((res) => {
                setResult(res);
                window.scrollTo({
                    top: 0,
                });
            })
            .finally(() => setIsLoading(false));
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <ContentLayout title="SQL test" icon="DataArray">
            {result && result.length > 0 ? result.map((r, i) => <SQLTestView res={r} key={i} />) : null}
            <FormMaker showBackPress={false} submitLabel="exécuter" isSubmitLoading={isLoading} structure={getStruct()} outputType="formData" onSubmit={onSubmit} />
        </ContentLayout>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

function SQLTestView({ res }: { res: SQLTestOutput }): JSX.Element {
    return (
        <Box className="mt-3">
            <Box>
                <Regular>
                    Temp d'exécution <b>{res.timeExec}ms</b>
                </Regular>
                <Regular>
                    Nombre de records : <b>{(res.datas ?? []).length}</b>
                </Regular>
                <Bold color={'purple'} className="my-2">
                    SQL : {res.sql.toUpperCase()}
                </Bold>
            </Box>
            {res.error ? (
                <Bold color={'red'}>{res.error.toUpperCase()}</Bold>
            ) : (
                <Box>
                    <Table size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {res.columns.map((c, i) => (
                                    <TableCell scope="row" component="th" key={i}>
                                        {c}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {res.datas.map((row, i1) => (
                                <TableRow key={i1}>
                                    {res.columns.map((c, i2) => (
                                        <TableCell key={i2} scope="row">
                                            {row[c]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}
        </Box>
    );
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
