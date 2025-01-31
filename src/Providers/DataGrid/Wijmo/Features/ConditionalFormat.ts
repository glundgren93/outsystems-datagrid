// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
    enum Rules {
        GreaterOrEqualsTo = '>=',
        GreaterThan = '>',
        Equals = '===',
        LessOrEqualsTo = '<=',
        LessThan = '<',
        NotEquals = '!==',
        Contains = 'Contains',
        DoesNotContain = 'DoesNotContain',
        BeginsWith = 'BeginsWith',
        EndWith = 'EndWith'
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function FormatDate(comparedValue: any, cellValue: any) {
        // Whenever we have null dates coming from OS, it has a different timezone than today's
        // this is the way JS handles dates before 1911: "historical timezone offsets are applied, prior to about 1900 most were not even hour or half hour offsets."
        // so we must ensure that our compared value (OS Null date) has this GMT as well.
        const comparedDate = new Date(comparedValue);
        const comparedYear = comparedDate.getUTCFullYear();
        if (comparedYear <= 1911) {
            const timezoneOffset = cellValue.toISOString().split('T')[1];

            // get UTC date of compared value and add timezoneOffset to it
            comparedValue =
                `${comparedYear}-0${(comparedDate.getUTCMonth() + 1)
                    .toString()
                    .slice(-2)}-0${comparedDate
                    .getUTCDate()
                    .toString()
                    .slice(-2)}T` + timezoneOffset;
        }

        const formattedCellValue = Helper.DataUtils.GetTicksFromDate(
            cellValue,
            comparedValue.indexOf('Z') > -1
        );
        const formatedComparedValue = Date.parse(
            Helper.DataUtils.ResetSeconds(comparedValue)
        );

        return [formatedComparedValue, formattedCellValue];
    }

    /**
     * Evaluates number and date cells
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function Evaluate(operator: Rules, comparedValue: any, cellValue: any = 0) {
        // in case we are comparing dates
        if (cellValue && typeof cellValue.getMonth === 'function') {
            const [formattedComparedValue, formattedCellValue] = FormatDate(
                comparedValue,
                cellValue
            );

            cellValue = formattedCellValue;
            comparedValue = formattedComparedValue;
        }

        switch (operator) {
            case Rules.GreaterOrEqualsTo:
                return cellValue >= comparedValue;
            case Rules.GreaterThan:
                return cellValue > comparedValue;
            case Rules.Equals:
                return comparedValue === cellValue;
            case Rules.NotEquals:
                return comparedValue !== cellValue;
            case Rules.LessOrEqualsTo:
                return cellValue <= comparedValue;
            case Rules.LessThan:
                return cellValue < comparedValue;
            default:
                return false;
        }
    }

    /**
     * Evaluates text cells
     *
     */
    function EvaluateText(operator: Rules, comparedValue = '', cellValue = '') {
        if (cellValue === null) return false;

        cellValue = cellValue.toLowerCase();
        comparedValue = comparedValue.toLowerCase();

        switch (operator) {
            case Rules.Equals:
                return comparedValue === cellValue;
            case Rules.NotEquals:
                return comparedValue !== cellValue;
            case Rules.BeginsWith:
                return cellValue.startsWith(comparedValue);
            case Rules.EndWith:
                return cellValue.endsWith(comparedValue);
            case Rules.Contains:
                return cellValue.includes(comparedValue);
            case Rules.DoesNotContain:
                return !cellValue.includes(comparedValue);
            default:
                return false;
        }
    }

    class Condition {
        public condition: Rules;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public value: any;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(condition: Rules, value: any) {
            this.condition = condition;
            this.value = value;
        }
    }

    class ConditionAnd {
        public cellClass: string;
        public rowClass: string;
        public rules: Array<Condition>;

        constructor(
            cellClass: string,
            rowClass: string,
            rules: Array<Condition>
        ) {
            this.cellClass = cellClass;
            this.rowClass = rowClass;
            this.rules = rules;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public evaluate(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cellValue: any,
            columnType: OSFramework.DataGrid.Enum.ColumnType
        ): boolean {
            const evaluated = this.rules.map((rule) => {
                if (
                    columnType ===
                        OSFramework.DataGrid.Enum.ColumnType.Dropdown ||
                    columnType === OSFramework.DataGrid.Enum.ColumnType.Text
                ) {
                    return EvaluateText(rule.condition, rule.value, cellValue);
                } else {
                    return Evaluate(rule.condition, rule.value, cellValue);
                }
            });

            return evaluated.indexOf(false) === -1;
        }
    }

    class ConditionExecuter {
        private _grid: Grid.IGridWijmo;
        public conditions: Array<ConditionAnd>;

        constructor(conditions: Array<ConditionAnd>, grid: Grid.IGridWijmo) {
            this.conditions = conditions;
            this._grid = grid;
        }

        /**
         * Adds or removes a cell class based on the condition. If the condition is true, we'll add the class, if it's false we'll remove it.
         * @param columnBinding
         * @param cellClass
         * @param rowNumber
         * @param shouldAdd
         */
        private _addOrRemoveCellClass(
            columnBinding: string,
            cellClass: string,
            rowNumber: number,
            shouldAdd: boolean
        ) {
            if (cellClass) {
                if (shouldAdd) {
                    this._grid.features.cellStyle.addClass(
                        columnBinding,
                        rowNumber,
                        cellClass
                    );
                } else {
                    this._grid.features.cellStyle.removeClass(
                        rowNumber,
                        columnBinding,
                        cellClass
                    );
                }
            }
        }

        /**
         * Adds or removes a row class based on the condition. If the condition is true, we'll add the class, if it's false we'll remove it.
         * @param columnBinding
         * @param rowClass
         * @param rowNumber
         * @param shouldAdd
         */
        private _addOrRemoveRowClass(
            columnBinding: string,
            rowClass: string,
            rowNumber: number,
            shouldAdd: boolean
        ) {
            if (rowClass) {
                if (shouldAdd) {
                    this._grid.features.rows.addClass(
                        rowNumber,
                        rowClass,
                        false,
                        columnBinding
                    );
                } else {
                    this._grid.features.rows.removeClass(
                        rowNumber,
                        rowClass,
                        false,
                        columnBinding
                    );
                }
            }
        }

        public execute(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cellValue: any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            e: any,
            columnType: OSFramework.DataGrid.Enum.ColumnType
        ) {
            this.conditions
                .map((condition) => {
                    return {
                        isTrue: condition.evaluate(cellValue, columnType), // add new property telling whether condition is true or false
                        ...condition
                    };
                })
                .sort((a, b) => +a.isTrue - +b.isTrue) // sort conditions by true/false
                .forEach((condition) => {
                    const binding = this._grid.provider.getColumn(
                        e.col
                    ).binding;

                    this._addOrRemoveRowClass(
                        binding,
                        condition.rowClass,
                        e.row,
                        condition.isTrue
                    );

                    this._addOrRemoveCellClass(
                        binding,
                        condition.cellClass,
                        e.row,
                        condition.isTrue
                    );
                });
        }
    }

    export class ConditionalFormat
        implements
            OSFramework.DataGrid.Feature.IConditionalFormat,
            OSFramework.DataGrid.Interface.IBuilder
    {
        private _grid: Grid.IGridWijmo;
        private _mappedRules: Map<string, ConditionExecuter>;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
            this._mappedRules = new Map<string, ConditionExecuter>();
        }

        private _parseRule(
            rules: Array<OSFramework.DataGrid.OSStructure.ConditionalFormat>
        ): ConditionExecuter {
            const conditionExecuters = [];
            rules.forEach((element) => {
                const conditions: Array<Condition> = element.format.map((c) => {
                    return new Condition(Rules[c.condition], c.value);
                });
                const conditionAnds = new ConditionAnd(
                    element.cellClass,
                    element.rowClass,
                    conditions
                );
                conditionExecuters.push(conditionAnds);
            });
            return new ConditionExecuter(conditionExecuters, this._grid);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        private _updatingViewHandler(s: any, e: any) {
            const columns = this._grid
                .getColumns()
                .filter((x) => this._mappedRules.get(x.config.binding));

            // iterate all rows and columns in order to get cell values
            s.rows.forEach((row, index) => {
                columns.forEach((column) => {
                    const isDropdown =
                        column.columnType ===
                        OSFramework.DataGrid.Enum.ColumnType.Dropdown;

                    const colIndex = this._grid.provider.columns.find(
                        (x) => x.binding === column.provider.binding
                    ).index;
                    const value = this._grid.provider.getCellData(
                        index,
                        colIndex,
                        isDropdown // on dropdown columns we want formatted value
                    );

                    this._mappedRules.get(column.config.binding).execute(
                        value,
                        {
                            row: index,
                            col: colIndex
                        },
                        column.columnType
                    );
                });
            });
        }

        public addRules(
            binding: string,
            rules: Array<OSFramework.DataGrid.OSStructure.ConditionalFormat>,
            refresh?: boolean
        ): void {
            // clear classes previously added
            if (refresh) {
                this._grid.features.cellStyle.clear();
                this._grid.features.rows.clear();
            }

            this._mappedRules.set(binding, this._parseRule(rules));
        }

        public build(): void {
            this._grid.provider.updatingView.addHandler(
                this._updatingViewHandler.bind(this)
            );
        }

        public removeRules(binding: string): void {
            this._mappedRules.delete(binding);
        }
    }
}
