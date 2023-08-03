<center>
# @prom-cms/schema

This is a schema package for prom-cms packages.
</center>

## Introduction

This package includes all schema, mainly generator config schemas, that PromCMS uses internally. This documentation won't describe every one of them - for this you should look at code, because it's very descriptive by itself since schemas are written with [zod](https://zod.dev/)

Nonetheless this documentation will describe how you should approach schema and describe field types and their meaning.

## Schema

PromCMS schema is split into two basic parts [Project](#project) and [Database](#database).

- [Project](./src/projectConfigSchema.ts) - This part describes project basic settings (such as name, slug, url, etc)

- [Database](./src/databaseConfigSchema.ts) - This part describes database layer of your project
    - [Models](./src/databaseConfigModelSchema.ts) - Record of all of your models (posts, products, etc) - extended from "Database Item Base"
    - [Singletons](./src/databaseConfigSingletonSchema.ts) - Record of all of your singletons (specific pages, contacts, or other non repetitive content) - extended from "Database Item Base"

- [Database Item Base](./src/databaseConfigItemBaseSchema.ts) - Base schema for Models and Singletons. Has defined columns and other config that is specific for both Models and Singletons
    - [Columns](./src/columnType/columnTypeSchema.ts) - Union record of multiple column types. Every column type extends "Column Type Base"
        - [Normal](./src/columnType/columnTypeNormalSchema.ts) - Basic column types that does not require specific options
            - `type`: Enum 
                - **date**
                - **password**
                - **dateTime**
                - **longText**
        - [JSON](./src/columnType/columnTypeJSONSchema.ts) - JSON column type. This field has also multiple types of fields in admin.
            - `admin`
                - `fieldType`: Enum 
                    - **repeater**
                        - With this you have to define your `columns` in repeater
                    - **blockEditor** - rich editor
                    - **jsonEditor** default - basic textarea with support of json 
                    - **openingHours** - opening hours field
        - [String](./src/columnType/columnTypeStringSchema.ts) - Basic string field. Can also take multiple rendering types in admin.
            - `admin`
                - `fieldType`: Enum
                    - **heading**
                    - **normal**
        - [Enum](./src/columnType/columnTypeEnumSchema.ts) - Classic enum field type

        - [File](./src/columnType/columnTypeFileSchema.ts) - Field for selecting fields from PromCMS file system. This field can also take multiple forms of rendering in admin.
            - `admin`
                - `fieldType`: Enum
                    - **normal** default
                    - **big-image**
                    - **small-image**

        - [Number](./src/columnType/columnTypeNumberSchema.ts) - Classic number field

        - [Relationship](./src/columnType/columnTypeRelationshipSchema.ts) - Relationship field type. With this you can "link" models between each other. This field renders as a select in admin.

        - [Slug](./src/columnType/columnTypeSlugSchema.ts) - Field type that automatically updates itself based on value of specified string field that is slugified

        - [Boolean](./src/columnType/columnTypeBooleanSchema.ts) - Classic boolean field. True or False

- [Column Type Base](./src/columnType/columnTypeBaseSchema.ts) - Options for every column type. Includes options for admin view, translations and more

