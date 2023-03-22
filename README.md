<h1 style="text-align: center">contenttruck-js</h1>

The JS/TS SDK for Contenttruck.

## How to Use

To use this library, you will want to import the client:
```ts
import { Client } from 'contenttruck-js';
```

You can now go ahead and initialize it with the URL that points to the base path for your Contenttruck instance:
```ts
const client = new Client('https://cdn.webscalesoftware.ltd/');
```

## Validation

All validators are exported from the package. These use zod and are internally inferred.

## Options in Rule Set

When using `createPartition`, you need to specify a rule set string that contains comma-separated options. Here are the possible options:

- `prefix`: specifies the path prefix that partitions will match.
- `exact`: specifies the exact path that partitions will match.
- `max-size`: specifies the maximum size of files that partitions will match.
- `ensure`: specifies a validation string that partitions must satisfy. This will be passed to the validation engine which supports these options separated by plus signs:
  - `X:Y`: specifies this has to be a image with a aspect ratio of X:Y.
  - `jpeg` or `jpg`: specifies this has to be a jpeg image.
  - `png`: specifies this has to be a png image.
  - `svg`: specifies this has to be a svg image.
- (invalid rule): any rule that is not one of the above options will result in an `ErrorCode.InvalidRuleset` being returned.
