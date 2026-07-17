export {};

declare global {
    interface String {
        capitalize(): string;
    }
}

String.prototype.capitalize = function (): string {
    const words = (this as String).split(' ');
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(' ');
};
