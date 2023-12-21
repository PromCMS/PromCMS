---
'@prom-cms/schema': minor
---

BREAKING: New required properties under database - "connections". Connections are specifications for connection to database inside your app. Each specification of connection can be granullary specified for each database (lets say you have two tables and each of one lives in different database). Also big new thing is removing keys of database tables/singletons/models and columns. Now keys can be defined in table and column item . This improves predicability of order in which are columns and tables created
