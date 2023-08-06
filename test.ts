import { Convertible } from "./mod.ts"

const o = {
    json: { arr: (json:string) => JSON.parse(json) },
    arr: {
        json: (arr: (string | number)[]) => JSON.stringify(arr),
        list: (arr: (string | number)[]) => arr.join("\n")
    },
    list: { arr: (list: string) => list.split("\n") }
}

const c = new Convertible<{
    json: string,
    list: string,
    arr: (string | number)[],
}, typeof o>(o)


console.log(c.convert("json", "arr", "[1,2,3]"))
console.log(c.convert("json", "list", "[1,2,3]"))
console.log(c.convert("list", "json", "1\n2\n3"))

c.findPath("json", "arr")