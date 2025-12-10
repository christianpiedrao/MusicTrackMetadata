import { ResultType } from "../types";

export function getResultType(resultType: unknown) {
    if (resultType && typeof resultType === 'string') {
        return ResultType[resultType as keyof typeof ResultType];
    } else if (resultType) {
        return resultType as ResultType;
    }

    return undefined;
}