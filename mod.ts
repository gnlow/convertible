type Conversions<T extends Record<string, unknown>> = {
    [A in keyof T]?: {
        [B in keyof T]?: (a: T[A]) => T[B]
    }
}

class Convertible<T extends Record<string, unknown>> {
    conversions
    constructor(conversions: Conversions<T>) {
        this.conversions = conversions
    }

    convert<A extends keyof T, B extends keyof T>(a: A, b: B, value: T[A]) {
        return this.conversions[a]?.[b]?.(value) as T[B]
    }
}

new Convertible<{
    number: number,
    string: string
}>(
    {
        number: {
            string: (n: number) => n.toString(),
        }
    }
)