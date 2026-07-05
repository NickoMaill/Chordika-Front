import NProgress from 'nprogress';

let onStartListeners: (() => void)[] = [];
let onDoneListeners: (() => void)[] = [];

export function startProgress(): void {
    NProgress.start();
    onStartListeners.forEach((cb) => cb());
}

export function doneProgress(): void {
    NProgress.done();
    onDoneListeners.forEach((cb) => cb());
}

export function onProgressStart(cb: () => void): void {
    onStartListeners.push(cb);
}

export function onProgressDone(cb: () => void): void {
    onDoneListeners.push(cb);
}

export function isProgressStarted(): boolean {
    return NProgress.isStarted();
}
