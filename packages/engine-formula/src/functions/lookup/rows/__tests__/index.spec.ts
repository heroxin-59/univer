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

import type { Injector } from '@wendellhu/redi';
import { beforeEach, describe, expect, it } from 'vitest';

import { Lexer } from '../../../../engine/analysis/lexer';
import type { LexerNode } from '../../../../engine/analysis/lexer-node';
import { AstTreeBuilder } from '../../../../engine/analysis/parser';
import type { BaseAstNode } from '../../../../engine/ast-node/base-ast-node';
import { Interpreter } from '../../../../engine/interpreter/interpreter';
import { IFormulaCurrentConfigService } from '../../../../services/current-data.service';
import { IFunctionService } from '../../../../services/function.service';
import { IFormulaRuntimeService } from '../../../../services/runtime.service';
import { createFunctionTestBed } from '../../../__tests__/create-function-test-bed';
import { FUNCTION_NAMES_LOOKUP } from '../../function-names';
import { Rows } from '..';
import type { BaseValueObject, ErrorValueObject } from '../../../../engine/value-object/base-value-object';
import { ErrorType } from '../../../../basics/error-type';

describe('Test rows', () => {
    let get: Injector['get'];
    let lexer: Lexer;
    let astTreeBuilder: AstTreeBuilder;
    let interpreter: Interpreter;

    beforeEach(() => {
        const testBed = createFunctionTestBed();

        get = testBed.get;

        lexer = get(Lexer);
        astTreeBuilder = get(AstTreeBuilder);
        interpreter = get(Interpreter);

        const functionService = get(IFunctionService);

        const formulaCurrentConfigService = get(IFormulaCurrentConfigService);

        const formulaRuntimeService = get(IFormulaRuntimeService);

        formulaCurrentConfigService.load({
            formulaData: {},
            arrayFormulaCellData: {},
            forceCalculate: false,
            numfmtItemMap: {},
            dirtyRanges: [],
            dirtyNameMap: {},
            dirtyDefinedNameMap: {},
            dirtyUnitFeatureMap: {},
            excludedCell: {},
            allUnitData: {
                [testBed.unitId]: testBed.sheetData,
            },
            dirtyUnitOtherFormulaMap: {},
        });

        const sheetItem = testBed.sheetData[testBed.sheetId];

        formulaRuntimeService.setCurrent(
            0,
            0,
            sheetItem.rowCount,
            sheetItem.columnCount,
            testBed.sheetId,
            testBed.unitId
        );

        functionService.registerExecutors(
            new Rows(FUNCTION_NAMES_LOOKUP.ROWS)
        );
    });

    describe('Rows', () => {
        it('Reference single cell', async () => {
            const lexerNode = lexer.treeBuilder('=ROWS(C1)');

            const astNode = astTreeBuilder.parse(lexerNode as LexerNode);

            const result = await interpreter.executeAsync(astNode as BaseAstNode);

            expect((result as BaseValueObject).getValue()).toBe(1);
        });
        it('Reference array cell', async () => {
            const lexerNode = lexer.treeBuilder('=ROWS(C2:F3)');

            const astNode = astTreeBuilder.parse(lexerNode as LexerNode);

            const result = await interpreter.executeAsync(astNode as BaseAstNode);

            expect((result as BaseValueObject).getValue()).toBe(2);
        });
        it('No reference', async () => {
            const lexerNode = lexer.treeBuilder('=ROWS()');

            const astNode = astTreeBuilder.parse(lexerNode as LexerNode);

            const result = await interpreter.executeAsync(astNode as BaseAstNode);

            expect((result as ErrorValueObject).getValue()).toBe(ErrorType.NA);
        });
        it('Text params', async () => {
            const lexerNode = lexer.treeBuilder('=ROWS("A5")');

            const astNode = astTreeBuilder.parse(lexerNode as LexerNode);

            const result = await interpreter.executeAsync(astNode as BaseAstNode);

            expect((result as BaseValueObject).getValue()).toBe(1);
        });
        it('Boolean params TRUE', async () => {
            const lexerNode = lexer.treeBuilder('=ROWS(TRUE)');

            const astNode = astTreeBuilder.parse(lexerNode as LexerNode);

            const result = await interpreter.executeAsync(astNode as BaseAstNode);

            expect((result as BaseValueObject).getValue()).toBe(1);
        });
        it('Boolean params FALSE', async () => {
            const lexerNode = lexer.treeBuilder('=ROWS(FALSE)');

            const astNode = astTreeBuilder.parse(lexerNode as LexerNode);

            const result = await interpreter.executeAsync(astNode as BaseAstNode);

            expect((result as BaseValueObject).getValue()).toBe(1);
        });
        it('Number params', async () => {
            const lexerNode = lexer.treeBuilder('=ROWS(11)');

            const astNode = astTreeBuilder.parse(lexerNode as LexerNode);

            const result = await interpreter.executeAsync(astNode as BaseAstNode);

            expect((result as BaseValueObject).getValue()).toBe(1);
        });
    });
});
