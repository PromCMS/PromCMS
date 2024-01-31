---
"@prom-cms/admin": minor
"@prom-cms/cli": minor
---

BREAKING: Changes folder structure of output PromCMS instances. Previously each app had modules and functionality was defined into those separable pieces, but after usage reports it deemed to be unnecessary complexity. Newly each app has src where you strucure your php source code and there is src/frontend folder for frontend related javascript code.
