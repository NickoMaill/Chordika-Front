import { ResultStatusEnum } from '~/types/serverCoreType';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import { ApiErrorType } from '~/models/Error';

class ServiceBase {
    protected appError: AppError;

    protected async asServicePromise<T>(request: Promise<T>): Promise<T> {
        return await request.then(
            (apiResponse) => Promise.resolve<T>(apiResponse),
            (error) => this.reject<T>(error as Error | AppError | ApiErrorType)
        );
    }

    protected reject<TResult>(error: Error | AppError | ApiErrorType | unknown): Promise<TResult> {
        if (error && (error as AppError).type) return Promise.reject(error);

        if (!(error as ApiErrorType).status) return Promise.reject(new AppError(ErrorTypeEnum.Undefined, (error as ApiErrorType).message));

        let type = ErrorTypeEnum.Undefined;

        switch ((error as ApiErrorType).status) {
            case ResultStatusEnum.Forbidden:
                type = ErrorTypeEnum.NotAllowed;
                break;
            case ResultStatusEnum.UnAuthorized:
                type = ErrorTypeEnum.SessionRequired;
                break;
            case ResultStatusEnum.NotAcceptable:
                type = ErrorTypeEnum.Maintenance;
                break;
            case ResultStatusEnum.BadRequest || ResultStatusEnum.Fatal || ResultStatusEnum.NotFound:
                type = ErrorTypeEnum.Technical;
                break;
            default:
                type = ErrorTypeEnum.Undefined;
                break;
        }

        const apiError = (error as { result: ApiErrorType }).result as ApiErrorType;
        console.error('error', apiError);
        return Promise.reject(new AppError(type, apiError.message, apiError.code, apiError.data as string));
    }
}

export default ServiceBase;
