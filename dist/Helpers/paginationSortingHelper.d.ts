export type IPaginationOptions = {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
};
type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
};
export declare const paginationHelpers: {
    calculatePagination: (options: IPaginationOptions) => IOptionsResult;
};
export {};
//# sourceMappingURL=paginationSortingHelper.d.ts.map