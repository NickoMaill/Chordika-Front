import NavigationResource from '~/resources/navigationResources';
import { CenterParentType, CenterRouteContextType, GenericActionEnum } from '~/types/centerType';

class CenterRouteHelper {
    private readonly centerPath = NavigationResource.routesPath.center;

    public parse(pathname: string): CenterRouteContextType | null {
        const segments = pathname
            .replace(this.centerPath, '')
            .split('/')
            .filter((s) => s !== '')
            .map((s) => decodeURIComponent(s));

        if (segments.length === 0) return null;

        const action = this.getAction(segments);
        const withoutAction = action === GenericActionEnum.TABLE ? [...segments] : segments.slice(0, -1);

        if (action === GenericActionEnum.NEW) {
            return this.buildNewContext(withoutAction);
        }

        if (action === GenericActionEnum.UPDATE || action === GenericActionEnum.DELETE) {
            return this.buildRecordContext(withoutAction, action);
        }

        if (action === GenericActionEnum.VIEW) {
            return this.buildRecordContext(withoutAction, action);
        }

        if (segments.length % 2 === 0) {
            return this.buildRecordContext(segments, GenericActionEnum.VIEW);
        }

        return this.buildTableContext(segments);
    }

    public buildPath(basePath: string, id?: string | number, action: GenericActionEnum = GenericActionEnum.TABLE): string {
        if (action === GenericActionEnum.NEW) {
            return `${basePath}/${GenericActionEnum.NEW}`;
        }

        if (!id) {
            return basePath;
        }

        if (action === GenericActionEnum.TABLE || action === GenericActionEnum.VIEW) {
            return `${basePath}/${id}`;
        }

        return `${basePath}/${id}/${action}`;
    }

    public buildApiUrl(url: string, params: URLSearchParams): string {
        const query = params.toString();
        if (!query) return url;

        return `${url}${url.includes('?') ? '&' : '?'}${query}`;
    }

    public getSubCenterParams(isSubCenter?: boolean): URLSearchParams {
        const query = new URLSearchParams();
        if (isSubCenter) query.append('isSub', 'true');
        return query;
    }

    public getParentConfigParams(isSubCenter?: boolean, parentField?: string, parentId?: string, parents: CenterParentType[] = []): URLSearchParams {
        const query = this.getSubCenterParams(isSubCenter || parents.length > 0);

        if (isSubCenter && parentField && parentId) {
            this.appendLegacyParent(query, parentField, parentId);
        }

        this.appendParents(query, parents);
        return query;
    }

    public getParentRequestParams(isSubCenter?: boolean, parents: CenterParentType[] = []): URLSearchParams {
        const query = this.getSubCenterParams(isSubCenter || parents.length > 0);
        this.appendParents(query, parents);
        return query;
    }

    public getLegacyParentFilters(parentField?: string, parentId?: string): { field: string; fieldName: string; values: string }[] {
        if (!parentField || !parentId) return [];

        return parentField.split('&').map((parent) => {
            const splitted = parent.split('=');
            if (splitted.length === 1) {
                return { field: splitted[0], fieldName: '', values: parentId };
            }

            return { field: splitted[0], fieldName: '', values: splitted[1] };
        });
    }

    private getAction(segments: string[]): GenericActionEnum {
        const last = segments[segments.length - 1];

        switch (last) {
            case GenericActionEnum.NEW:
                return GenericActionEnum.NEW;
            case GenericActionEnum.UPDATE:
                return GenericActionEnum.UPDATE;
            case GenericActionEnum.DELETE:
                return GenericActionEnum.DELETE;
            case GenericActionEnum.VIEW:
                return GenericActionEnum.VIEW;
            default:
                return GenericActionEnum.TABLE;
        }
    }

    private buildNewContext(segments: string[]): CenterRouteContextType | null {
        if (segments.length === 0 || segments.length % 2 === 0) return null;

        const entity = segments[segments.length - 1];
        const parentSegments = segments.slice(0, -1);
        const parents = this.buildParents(parentSegments);
        const basePath = this.buildBasePath(parents, entity);

        return {
            entity,
            action: GenericActionEnum.NEW,
            parents,
            basePath,
            currentPath: this.buildPath(basePath, null, GenericActionEnum.NEW),
        };
    }

    private buildRecordContext(segments: string[], action: GenericActionEnum): CenterRouteContextType | null {
        if (segments.length < 2 || segments.length % 2 !== 0) return null;

        const id = segments[segments.length - 1];
        const entity = segments[segments.length - 2];
        const parentSegments = segments.slice(0, -2);
        const parents = this.buildParents(parentSegments);
        const basePath = this.buildBasePath(parents, entity);

        return {
            entity,
            id,
            action,
            parents,
            basePath,
            currentPath: this.buildPath(basePath, id, action),
        };
    }

    private buildTableContext(segments: string[]): CenterRouteContextType | null {
        if (segments.length === 0 || segments.length % 2 === 0) return null;

        const entity = segments[segments.length - 1];
        const parentSegments = segments.slice(0, -1);
        const parents = this.buildParents(parentSegments);
        const basePath = this.buildBasePath(parents, entity);

        return {
            entity,
            action: GenericActionEnum.TABLE,
            parents,
            basePath,
            currentPath: basePath,
        };
    }

    private buildParents(segments: string[]): CenterParentType[] {
        if (segments.length % 2 !== 0) return [];

        const parents: CenterParentType[] = [];
        for (let i = 0; i < segments.length; i += 2) {
            parents.push({
                entity: segments[i],
                id: segments[i + 1],
            });
        }

        return parents;
    }

    private buildBasePath(parents: CenterParentType[], entity: string): string {
        const parentPath = parents.map((p) => `${p.entity}/${p.id}`).join('/');
        return `${this.centerPath}/${parentPath ? `${parentPath}/` : ''}${entity}`;
    }

    private appendParents(query: URLSearchParams, parents: CenterParentType[]): void {
        parents.forEach((parent) => {
            query.append('parent', `${parent.entity}:${parent.id}`);
        });
    }

    private appendLegacyParent(query: URLSearchParams, parentField: string, parentId: string): void {
        this.getLegacyParentFilters(parentField, parentId).forEach((parent) => {
            query.append(parent.field, parent.values);
        });
    }
}

const centerRouteHelper = new CenterRouteHelper();
export default centerRouteHelper;
