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

import { ICommandService, Plugin, PluginType } from '@univerjs/core';
import { Inject, Injector } from '@wendellhu/redi';
import { SHEET_CONDITIONAL_FORMATTING_PLUGIN, SheetsConditionalFormattingPlugin } from '@univerjs/sheets-conditional-formatting';
import { AddAverageCfCommand } from './commands/commands/add-average-cf.command';
import { AddColorScaleConditionalRuleCommand } from './commands/commands/add-color-scale-cf.command';
import { AddDataBarConditionalRuleCommand } from './commands/commands/add-data-bar-cf.command';
import { AddDuplicateValuesCfCommand } from './commands/commands/add-duplicate-values-cf.command';
import { AddNumberCfCommand } from './commands/commands/add-number-cf.command';
import { AddRankCfCommand } from './commands/commands/add-rank-cf.command';
import { AddTextCfCommand } from './commands/commands/add-text-cf.command';
import { AddTimePeriodCfCommand } from './commands/commands/add-time-period-cf.command';
import { AddUniqueValuesCfCommand } from './commands/commands/add-unique-values-cf.command';
import { ClearRangeCfCommand } from './commands/commands/clear-range-cf.command';
import { ClearWorksheetCfCommand } from './commands/commands/clear-worksheet-cf.command';
import { OpenConditionalFormattingOperator } from './commands/operations/open-conditional-formatting-panel';
import { DeleteCfCommand } from './commands/commands/delete-cf.command';
import { SetCfCommand } from './commands/commands/set-cf.command';
import { moveCfCommand } from './commands/commands/move-cf.command';
import { AddCfCommand } from './commands/commands/add-cf.command';

import { RenderController } from './controllers/cf.render.controller';
import { ConditionalFormattingCopyPasteController } from './controllers/cf.copy-paste.controller';
import { ConditionalFormattingAutoFillController } from './controllers/cf.auto-fill.controller';
import { ConditionalFormattingMenuController } from './controllers/cf.menu.controller';
import { ConditionalFormattingI18nController } from './controllers/cf.i18n.controller';
import { RefRangeController } from './controllers/cf.ref-range.controller';
import { ConditionalFormattingEditorController } from './controllers/cf.editor.controller';
import { ConditionalFormattingClearController } from './controllers/cf.clear.controller';

export class UniverSheetsConditionalFormattingUIPlugin extends Plugin {
    static override type = PluginType.Sheet;
    static commandList = [
        AddAverageCfCommand,
        AddColorScaleConditionalRuleCommand,
        AddDataBarConditionalRuleCommand,
        AddDuplicateValuesCfCommand,
        AddNumberCfCommand,
        AddRankCfCommand,
        AddTextCfCommand,
        AddTimePeriodCfCommand,
        AddUniqueValuesCfCommand,
        OpenConditionalFormattingOperator,
        DeleteCfCommand,
        SetCfCommand,
        moveCfCommand,
        AddCfCommand,
        ClearRangeCfCommand,
        ClearWorksheetCfCommand,
    ];

    constructor(
        _config: unknown,
        @Inject(Injector) override readonly _injector: Injector,
        @Inject(ICommandService) private _commandService: ICommandService
    ) {
        super(SHEET_CONDITIONAL_FORMATTING_PLUGIN);
        this._initCommand();
        SheetsConditionalFormattingPlugin.dependencyList.forEach((dependency) => {
            this._injector.add(dependency);
        });
        this._injector.add([RenderController]);
        this._injector.add([RefRangeController]);
        this._injector.add([ConditionalFormattingCopyPasteController]);
        this._injector.add([ConditionalFormattingAutoFillController]);
        this._injector.add([ConditionalFormattingMenuController]);
        this._injector.add([ConditionalFormattingI18nController]);
        this._injector.add([ConditionalFormattingEditorController]);
        this._injector.add([ConditionalFormattingClearController]);
    }

    _initCommand() {
        [...SheetsConditionalFormattingPlugin.mutationList, ...UniverSheetsConditionalFormattingUIPlugin.commandList].forEach((m) => {
            this._commandService.registerCommand(m);
        });
    }
}
