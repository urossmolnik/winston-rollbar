# winston-transport-rollbar [![Build Status](https://secure.travis-ci.org/GorillaStack/winston-rollbar.png)](http://travis-ci.org/GorillaStack/winston-rollbar)

Forked from https://github.com/Ideame/winston-rollbar and updated to support latest reporter and maintain longer term.

A [rollbar][1] transport for [winston][0].

## Installation

``` sh
  $ npm install winston
  $ npm install winston-transport-rollbar
```

## ES6 usage

``` js
  import winston from 'winston';
  import { Rollbar } from 'winston-transport-rollbar';

  winston.add(winston.transports.Rollbar, options);
  // or
  const logger = new winston.Logger({ transports: [new Rollbar({
      rollbarConfig: {
        accessToken: serverAccessToken,
        environment: environment,
        reportLevel: reportLevel,
      },
    })]
  });
```

## ES5 usage

``` js
  var winston = require('winston');

  //
  // Requiring `winston-rollbar` will expose
  // `winston.transports.Rollbar`
  //
  require('winston-transport-rollbar').Rollbar;

  winston.add(winston.transports.Rollbar, options);
```

## Options

The Rollbar transport uses the universal [rollbar.js](https://github.com/rollbar/rollbar.js) library behind the scenes.  Options are the following:

* **rollbarConfig**:        Rollbar configuration ([more info](https://rollbar.com/docs/notifier/node_rollbar/#configuration-reference)) (mandatory, must contain rollbarAccessToken)
* **metadataAsRequest**:    Uses metadata object as Rollbar's request parameter. (default: **false** will send for **meta.req** if provided)
* **level**:                Level of messages this transport should log. (default: **warn**).
* **silent**:               Boolean flag indicating whether to suppress output (default: **false**).

[0]: https://github.com/flatiron/winston
[1]: https://rollbar.com
[2]: https://github.com/rollbar/node_rollbar
