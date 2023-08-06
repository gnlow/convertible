export type Conversions<T extends Record<string, unknown>> = {
    [A in keyof T]?: {
        [B in keyof T]?: (a: T[A]) => T[B]
    }
}

export const flow = <A, B, C>(aToB: (a: A) => B, bToC: (b: B) => C) => (a: A) => bToC(aToB(a))

export class Convertible<T extends Record<string, unknown>> {
    conversions
    constructor(conversions: Conversions<T>) {
        this.conversions = conversions
    }

    findPath<A extends keyof T, B extends keyof T>(a: A, b: B) {
        const aTo = this.conversions[a]
        if (aTo) {
            if (aTo[b]) {
                return true
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
                    return true
                }
                return false
            }
        } else {
            return false
        }
    }
    convert<A extends keyof T, B extends keyof T>(a: A, b: B, value: T[A]): T[B] {
        if (this.findPath(a, b)) {
            return this.conversions[a]![b]!(value) as T[B]
        } else {
            throw new Error("No path found")
        }
    }
}
