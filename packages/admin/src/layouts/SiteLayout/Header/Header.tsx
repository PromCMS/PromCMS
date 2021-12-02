import { VFC } from 'react'
import { Link } from 'react-router-dom'

const menuItems = [{ label: 'Domů', href: '/' }]

const Header: VFC = () => {
  return (
    <header className="w-full py-4 border-b border-gray-400">
      <div className="container mx-auto">
        <div>
          {menuItems.map((item) => (
            <Link
              to={item.href}
              key={item.href}
              className="uppercase font-bold"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Header
