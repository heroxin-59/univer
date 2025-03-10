/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type {
    BooleanNumber,
    ICellData,
    IColumnData,
    IObjectArrayPrimitiveType,
    IObjectMatrixPrimitiveType,
    IRange,
    IRowData,
    IUnitRange,
    Nullable,
    ObjectMatrix,
} from '@univerjs/core';

export const ERROR_VALUE_OBJECT_CLASS_TYPE = 'errorValueObject';

export const ASYNC_OBJECT_CLASS_TYPE = 'asyncObject';

export const REFERENCE_OBJECT_CLASS_TYPE = 'referenceObject';

export const VALUE_OBJECT_CLASS_TYPE = 'valueObject';

export enum BooleanValue {
    FALSE = 'FALSE',
    TRUE = 'TRUE',
}

export enum AstNodePromiseType {
    SUCCESS,
    ERROR,
}

export interface ISheetItem {
    cellData: ObjectMatrix<ICellData>;
    rowCount: number;
    columnCount: number;
    rowData: IObjectArrayPrimitiveType<Partial<IRowData>>;
    columnData: IObjectArrayPrimitiveType<Partial<IColumnData>>;
}

export interface ISheetData {
    [sheetId: string]: ISheetItem;
}

/**
 * The subset of workbook data needs to be assembled into a new reference object when being passed in,
 * and then input through the FormulaCurrentConfigService.
 */
export interface IUnitData {
    [unitId: string]: ISheetData;
}

export interface IRuntimeUnitDataType {
    [unitId: string]: Nullable<{ [sheetId: string]: ObjectMatrix<Nullable<ICellData>> }>;
}

export interface IRuntimeUnitDataPrimitiveType {
    [unitId: string]: Nullable<{ [sheetId: string]: IObjectMatrixPrimitiveType<Nullable<ICellData>> }>;
}

export interface IRuntimeOtherUnitDataType {
    [unitId: string]: Nullable<{ [sheetId: string]: Nullable<{ [formulaId: string]: Nullable<ICellData>[][] }> }>;
}

export interface IUnitSheetNameMap {
    [unitId: string]: Nullable<{ [sheetName: string]: string }>;
}

export interface IUnitSheetIdToNameMap {
    [unitId: string]: Nullable<{ [sheetId: string]: string }>;
}

export interface IDirtyUnitSheetNameMap {
    [unitId: string]: Nullable<{ [sheetId: string]: string }>;
}

export interface IDirtyUnitSheetDefinedNameMap {
    [unitId: string]: Nullable<{ [name: string]: string }>;
}

export interface IDirtyUnitFeatureMap {
    [unitId: string]: Nullable<{ [sheetId: string]: { [featureId: string]: boolean } }>;
}

export interface IDirtyUnitOtherFormulaMap {
    [unitId: string]: Nullable<{ [sheetId: string]: { [formulaId: string]: boolean } }>;
}

export interface IArrayFormulaRangeType {
    [unitId: string]: Nullable<{ [sheetId: string]: IObjectMatrixPrimitiveType<IRange> }>;
}

export interface IFeatureDirtyRangeType {
    [unitId: string]: Nullable<{ [sheetId: string]: IRange[] }>;
}

export interface IArrayFormulaUnitCellType extends IRuntimeUnitDataPrimitiveType {}

export interface IFormulaData {
    [unitId: string]: Nullable<{ [sheetId: string]: IObjectMatrixPrimitiveType<IFormulaDataItem> }>;
}

export interface IOtherFormulaData {
    [unitId: string]: Nullable<{ [subUnitId: string]: Nullable<{ [formulaId: string]: IFormulaDataItem }> }>;
}

export interface INumfmtItemMap {
    [unitId: string]: Nullable<{ [sheetId: string]: IObjectMatrixPrimitiveType<Nullable<string>> }>;
}

/**
 * @f  formulaString, the text string of the formula.
 * @si The formula ID can be utilized in scenarios such as copy-pasting and drag-filling to convert formulas into references, eliminating the need for recreating the formulaString.
 */
export interface IFormulaDataItem {
    f: string; // formulaString
    x?: number; // Offset from x direction
    y?: number; // Offset from y direction
    si?: string; // formulaId,
    // row: number;
    // column: number;
    // sheetId: string;
}

export interface ISuperTable {
    sheetId: string;
    hasCustomTitle: BooleanNumber;
    titleMap: Map<string, number>;
    range: IRange;
}

export enum TableOptionType {
    ALL = '#All',
    DATA = '#Data',
    HEADERS = '#Headers',
    TOTALS = '#Totals',
}

export interface IUnitExcludedCell {
    [unitId: string]: Nullable<{ [sheetId: string]: ObjectMatrix<boolean> }>;
}

export interface IFormulaDatasetConfig {
    formulaData: IFormulaData;
    arrayFormulaCellData: IArrayFormulaUnitCellType;
    forceCalculate: boolean;
    dirtyRanges: IUnitRange[];
    dirtyNameMap: IDirtyUnitSheetNameMap;
    dirtyDefinedNameMap: IDirtyUnitSheetNameMap;
    dirtyUnitFeatureMap: IDirtyUnitFeatureMap;
    dirtyUnitOtherFormulaMap: IDirtyUnitOtherFormulaMap;
    numfmtItemMap: INumfmtItemMap;
    excludedCell?: IUnitExcludedCell;
    allUnitData?: IUnitData;
    unitSheetNameMap?: IUnitSheetNameMap;
}

export enum ConcatenateType {
    FRONT,
    BACK,
}
