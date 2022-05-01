import { VFC } from 'react'

const Footer: VFC = () => {
  return (
    <footer className="w-full py-4">
      <div className="container mx-auto mb-10">
        <span>
          prom cms{' '}
          {process.env.NODE_ENV === 'development' ? '@ development' : ''}
        </span>
      </div>
    </footer>
  )
}

export default Footer
