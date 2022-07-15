import { VFC } from 'react'

export interface ProfileProps {
  title?: string
  image?: string
}

export const Profile: VFC<ProfileProps> = ({ title }) => {
  return (
    <article>
      <div></div>
      <div>
        <h1></h1>
      </div>
    </article>
  )
}
