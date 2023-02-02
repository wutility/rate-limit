# Installation

```shell
# Using npm
> npm install rateli
# Using yarn or pnpm
> yarn/pnpm add rateli
```

## Usage

import it in a CommonJS project (type: commonjs or no type field in
package.json) as follows:

```js
const { rateLimit } = require("rateli");
```

Import it in a ESM project (type: module in package.json) as follows:

```js
import { rateLimit } from "rateli";
```

## Methods

```js
rateLimit(config: Config) : Function

RateLimitBanHandler() : Function
```

## Examples

```js
import { rateLimit, RateLimitBanHandler } from "rateli";

const config = {
  windowMs: 60000,             // Time window in milliseconds (1 min)
  max: 5,                      // Max number of requests allowed in a time window
  maxReputation: 1000,         // Max number of reputations allowed (auto insert to blacklist)
  message: 'Too Many Requests',
  headers: true,               // Include the rate limit in the response headers

  // Generate a unique key based on the client's IP or x-api-key header
  keyGenerator: (req: Request) => string
}

const limiter = rateLimit(config);

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(RateLimitBanHandler()) // when reputations (of IP) exceed limits, server returns 503
```

## License
[Apache 2.0](LICENSE)