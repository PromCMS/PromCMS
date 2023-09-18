---
'@prom-cms/cli': patch
---

Fix user actions by updating validate function as that validate must return true incase of success and false or string incase of fail.

Furthermore create-project-module job should not format module name to lowercase.
