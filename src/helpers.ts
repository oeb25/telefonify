export function assign<A, B>(a: A, b: B): A & B;
export function assign<A, B, C>(a: A, b: B, c: C): A & B & C;
export function assign<A, B, C, D>(a: A, b: B, c: C, d: D): A & B & C & D;
export function assign(a: any, ...rest: any[]): any {
    rest.forEach(x => Object.keys(x).forEach(k => a[k] = x[k]))

    return a
}

export function splitEvery<T>(n: number, xs: T[]): T[][] {
    let out = []

    xs.reduce((a, b, i) => {
        if (i % n) {
            a.push(b)
            return a
        } else {
            let o = [b]
            out.push(o)
            return o
        }
    }, [])

    return out
}

export function keys<T>(a: T): Array<keyof T> {
    return Object.keys(a) as Array<keyof T>
}