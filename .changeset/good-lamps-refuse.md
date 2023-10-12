---
'@prom-cms/admin': patch
---

Implement logging on admin for developers to debug on unwanted behavior. This logs are always attached to window.application.logs property and can also be projected into console itself when `debug` search param is present in current url. This logging is used for when entry form is being validated.
