export default function twingLower(value: string) {
    // todo: use charset
    return (typeof value === 'string') ? value.toLowerCase() : value;
}