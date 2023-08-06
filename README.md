# convertible

Automatic conversion

## Usage

```ts
import { Convertible } from "https://deno.land/x/convertible/mod.ts"

const c = new Convertible<{
    json: string,
    list: string,
    arr: (string | number)[],
}>(
    {
        json: { arr: JSON.parse },
        arr: {
            json: JSON.stringify,
            list: arr => arr.join("\n")
        },
        list: { arr: list => list.split("\n") }
    }
)


console.log(c.convert("json", "arr", "[1,2,3]"))
console.log(c.convert("json", "list", "[1,2,3]"))
console.log(c.convert("list", "json", "1\n2\n3"))
```