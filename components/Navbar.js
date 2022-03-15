import { BsReceipt  } from 'react-icons/bs'
import { AiOutlineHome } from 'react-icons/ai'
import { MdOutlineBugReport, MdPostAdd } from 'react-icons/md'
import {FaShoppingBasket} from 'react-icons/fa'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

function Navbar() {

  const router = useRouter()
  //active link

  const isActive = (path) => {
    if (router.pathname === path) {
      return 'text-blue-900'
    }
    return 'text-blue-400'
  }

  return (

    <footer className="fixed inset-0 top-auto flex items-center justify-center h-20 navbar mt-20">
      <nav className="w-full navbarNav">
        <ul className="flex w-screen navbarListItems justify-evenly">
          <li className="navbarListItem">
            <NextLink href="/" passHref>
              <div className="navbarListItemLink">
                <AiOutlineHome className={`text-3xl text-b navbarListItemLinkIcon ${isActive('/')}`} />
                <span className={"navbarListItemLinkText " + isActive('/')}>
                  Home
                </span>
              </div>
            </NextLink>
          </li>
          <li className="navbarListItem">
            <NextLink href="/przepisy" passHref>
              <div className="navbarListItemLink">
                <BsReceipt className={`text-3xl text-b navbarListItemLinkIcon ${isActive('/przepisy')}`} />
                <span className={"navbarListItemLinkText " + isActive('/przepisy')}>
                  Przepisy
                </span>
              </div>
            </NextLink>
          </li>
          <li className="navbarListItem">
            <NextLink href="/przepisy/add" passHref>
              <div className="navbarListItemLink">
                <MdPostAdd className={`text-3xl text-b navbarListItemLinkIcon ${isActive('/przepisy/add')}`} />
                <span className={"navbarListItemLinkText " + isActive('/przepisy/add')}>
                  Dodaj nowy
                </span>
              </div>
            </NextLink>
          </li>
          <li className="navbarListItem">
            <NextLink href="/list" passHref>
              <div className="navbarListItemLink">
                <FaShoppingBasket className={`text-3xl text-b navbarListItemLinkIcon ${isActive('/list')}`} />
                <span className={"navbarListItemLinkText " + isActive('/list')}>
                  Lista zakupów
                </span>
              </div>
            </NextLink>
          </li>
          <li className="navbarListItem">
            <NextLink href="/contact" passHref>
              <div className="navbarListItemLink">
                <MdOutlineBugReport className={`text-3xl navbarListItemLinkIcon ${isActive('/contact')}`} />
                <span className={"navbarListItemLinkText " + isActive('/contact')}>
                  Zgłoś błąd
                </span>
              </div>
            </NextLink>
          </li>

        </ul>
      </nav>

    </footer>

  )
}

export default Navbar;
