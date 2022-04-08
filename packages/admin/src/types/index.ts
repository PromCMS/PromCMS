import { NextPage as DefaultNextPage } from 'next'
import { FC, ReactElement } from 'react'

export type ReactChildren = Parameters<FC>['0']['children']

export type EntryTypeUrlActionType = 'create' | 'update'

export type NextPage = DefaultNextPage & {
  getLayout?: (page?: ReactElement) => ReactElement<any, any> | null
}
