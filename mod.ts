export type Conversions<T extends Record<string, unknown>> = {
    [A in keyof T & string]?: {
        [B in keyof T & string]?: (a: T[A]) => T[B]
    }
}

export const flow = <A, B, C>(aToB: (a: A) => B, bToC: (b: B) => C) => (a: A) => bToC(aToB(a))

export class Convertible<
    T extends Record<string, unknown>,
    C extends Conversions<T>,
> {
    conversions
    constructor(conversions: C) {
        this.conversions = conversions
    }

    findPath<A extends keyof T & string, B extends keyof T & string>(a: A, b: B)
    : IsPathAvailable<T, C, A, B> {
        const aTo = this.conversions[a]
        if (aTo) {
            if (aTo[b]) {
                return true as any
            } else {
                const findResult = Object.entries(aTo).find(([k]) => {
                    const kTo = this.conversions[k]
                    if (kTo) {
                        if (this.findPath(k, b)) {
                            aTo[b] = flow(aTo[k]!, kTo[b]!)
                            return true
                        }
                    }
                })
                if (findResult) {
                    return true as any
                }
                return false as any
            }
        } else {
            return false as any
        }
    }
    convert<A extends keyof T, B extends keyof T>(a: A, b: B, value: T[A])
    : IsPathAvailable<T, Conversions<T>, A, B> extends true ? T[B] : undefined {
        if (this.findPath(a, b)) {
            return this.conversions[a]![b]!(value) as T[B] as any
        } else {
            return undefined as any
        }
    }
}

type IsPathAvailable<
    T extends Record<any, unknown>,
    C extends Conversions<T>,
    A extends keyof T,
    B extends keyof T,
> = A extends keyof C
    ? B extends keyof C[A]
        ? true
        : keyof C[A] extends any
            ? 
                (
                    keyof C[A] extends keyof T
                        ? IsPathAvailable<T, C, keyof C[A], B>
                        : "LOL"
                ) extends false ? false : true
                /*
                    (0 | 1) -> 1
                    1 -> 1
                    0 -> 0
                 */
            : never
    : false

type Test = IsPathAvailable<
    {a: 1, b: 2, c: 3, d: 4},
    {
        a: {
            b: (a: 1) => 2
            d: (a: 1) => 4,
        },
        b: {
            c: (b: 2) => 3,
        },
    },
    "a",
    "c"
>