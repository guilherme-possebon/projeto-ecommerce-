import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'

export default function Nav() {
  const inactiveLink = 'flex gap-1 p-1'
  const activeLink =
    inactiveLink + ' bg-hightlight text-black dark:textDarkMode rounded-sm'
  const inactiveIcon = 'w-6 h-6'
  const activeIcon = inactiveIcon + ' text-primary'
  const router = useRouter()
  const { pathname } = router

  async function logout() {
    await router.push('/')
    await signOut()
  }

  const [checked, setChecked] = useState<boolean>(true)
  const htmlElement = document.querySelector('html')

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }
  if (checked) {
    htmlElement?.classList.add('dark')
  } else {
    htmlElement?.classList.remove('dark')
  }

  return (
    <aside className="text-gray-500 p-4">
      <Link href={'/'} className="flex gap-1 mb-4 mr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 007.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 004.902-5.652l-1.3-1.299a1.875 1.875 0 00-1.325-.549H5.223z" />
          <path
            fillRule="evenodd"
            d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 009.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 002.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3zm3-6a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-3zm8.25-.75a.75.75 0 00-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-5.25a.75.75 0 00-.75-.75h-3z"
            clipRule="evenodd"
          />
        </svg>

        <span>Admin</span>
      </Link>
      <nav className="flex flex-col gap-2">
        <Link
          href={'/'}
          className={pathname === '/' ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={pathname === '/' ? activeIcon : inactiveIcon}
          >
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
          Dashboard
        </Link>
        <Link
          href={'/products'}
          className={pathname.includes('/products') ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={
              pathname.includes('/products') ? activeIcon : inactiveIcon
            }
          >
            <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
            <path
              fillRule="evenodd"
              d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
          Produtos
        </Link>
        <Link
          href={'/categories'}
          className={
            pathname.includes('/categories') ? activeLink : inactiveLink
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={
              pathname.includes('/categories') ? activeIcon : inactiveIcon
            }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          Categorias
        </Link>
        <Link
          href={'/orders'}
          className={pathname.includes('/orders') ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={pathname.includes('/orders') ? activeIcon : inactiveIcon}
          >
            <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
          </svg>
          Pedidos
        </Link>
        <Link
          href={'/settings'}
          className={pathname.includes('/settings') ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={
              pathname.includes('/settings') ? activeIcon : inactiveIcon
            }
          >
            <path
              fillRule="evenodd"
              d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
              clipRule="evenodd"
            />
          </svg>
          Configurações
        </Link>
        <button type="button" onClick={logout} className={inactiveLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Logout
        </button>
        <div className="flex gap-1 p-1">
          <label htmlFor="toggle" className="theme-switcher-label">
            <input type="checkbox" checked={checked} onChange={handleInput} />
            <svg viewBox="0 0 100 45" width="400" height="180">
              <defs>
                <rect
                  id="background"
                  x="0"
                  y="0"
                  width="90"
                  height="40"
                  rx="20"
                ></rect>
                <clipPath id="clip">
                  <use href="#background"></use>
                </clipPath>
                <linearGradient id="gradient-light" x1="0" x2="0" y1="0" y2="1">
                  <stop stopColor="#8bc8f2" offset="0"></stop>
                  <stop stopColor="#fff" offset="1"></stop>
                </linearGradient>
                <filter id="blur-light">
                  <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                </filter>
                <pattern
                  id="pattern-light"
                  width="0.1"
                  height="1"
                  viewBox="0 0 10 45"
                >
                  <path
                    fill="#40b5f8"
                    d="M 0 0 a 6 6 0 0 0 10 0 v 45 h -10 z"
                  ></path>
                </pattern>
                <linearGradient id="gradient-dark" x1="0" x2="0" y1="0" y2="1">
                  <stop stopColor="#1F2241" offset="0"></stop>
                  <stop stopColor="#7D59DF" offset="1"></stop>
                </linearGradient>
                <linearGradient id="gradient-mask" x1="0" x2="0" y1="0" y2="1">
                  <stop stopColor="#000" offset="0"></stop>
                  <stop stopColor="#fff" offset="1"></stop>
                </linearGradient>
                <mask id="mask-dark">
                  <use fill="url(#gradient-mask)" href="#background"></use>
                </mask>
                <radialGradient id="gradient-moon">
                  <stop stopColor="#fdfdfd" offset="0.7"></stop>
                  <stop stopColor="#e2e2e2" offset="1"></stop>
                </radialGradient>
                <radialGradient id="gradient-crater">
                  <stop stopColor="#e0e0e0" offset="0"></stop>
                  <stop stopColor="#d9d9d9" offset="1"></stop>
                </radialGradient>
                <pattern
                  id="pattern-dark"
                  width="0.2"
                  height="1"
                  viewBox="0 0 20 45"
                >
                  <path
                    fill="#fff"
                    d="M 2 5 l 1 1 l -1 1 l -1 -1 l 1 -1"
                  ></path>
                  <path
                    fill="#fff"
                    d="M 10 16 l 1 1 l -1 1 l -1 -1 l 1 -1"
                  ></path>
                  <path
                    fill="#fff"
                    d="M 16 27 l 1 1 l -1 1 l -1 -1 l 1 -1"
                  ></path>
                  <path
                    fill="#fff"
                    d="M 10 38 l 1 1 l -1 1 l -1 -1 l 1 -1"
                  ></path>
                </pattern>
              </defs>
              <g transform="translate(5 2.5)">
                <g clipPath="url(#clip)">
                  <g className="dark">
                    <use fill="url(#gradient-dark)" href="#background"></use>
                    <g
                      className="background"
                      transform="translate(0 -40) scale(1 0.4)"
                    >
                      <rect
                        transform="translate(-40 0) rotate(4)"
                        fill="url(#pattern-dark)"
                        x="0"
                        y="0"
                        width="100"
                        height="45"
                      ></rect>
                    </g>
                    <use
                      mask="url(#mask-dark)"
                      fill="url(#gradient-dark)"
                      href="#background"
                    ></use>
                  </g>
                  <g className="light">
                    <use fill="url(#gradient-light)" href="#background"></use>
                    <g className="background" transform="translate(-30 -20)">
                      <g transform="translate(30 20)">
                        <rect
                          fill="url(#pattern-light)"
                          x="-5"
                          y="27.5"
                          width="100"
                          height="45"
                        ></rect>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
              <g transform="translate(77.5 22.5)">
                <g className="translate" transform="translate(-55)">
                  <g className="rotate" transform="rotate(-100)">
                    <g className="dark">
                      <circle
                        fill="url(#gradient-moon)"
                        cx="0"
                        cy="0"
                        r="20.5"
                      ></circle>
                      <g transform="translate(-8 -7.5)">
                        <ellipse
                          transform="rotate(-30)"
                          fill="url(#gradient-crater)"
                          stroke="#d5d5d5"
                          strokeWidth="0.2"
                          cx="0"
                          cy="0"
                          rx="4"
                          ry="3"
                        ></ellipse>
                      </g>
                      <g transform="translate(11 5)">
                        <ellipse
                          fill="url(#gradient-crater)"
                          stroke="#d5d5d5"
                          strokeWidth="0.2"
                          cx="0"
                          cy="0"
                          rx="3.85"
                          ry="4"
                        ></ellipse>
                      </g>
                      <g transform="translate(-6 12)">
                        <ellipse
                          transform="rotate(-10)"
                          fill="url(#gradient-crater)"
                          stroke="#d5d5d5"
                          strokeWidth="0.2"
                          cx="0"
                          cy="0"
                          rx="2"
                          ry="1.75"
                        ></ellipse>
                      </g>
                    </g>
                  </g>
                  <g className="light">
                    <circle
                      fill="#FFD21F"
                      cx="0"
                      cy="0"
                      r="21"
                      filter="url(#blur-light)"
                    ></circle>
                    <circle fill="#FFD21F" cx="0" cy="0" r="20.5"></circle>
                  </g>
                </g>
              </g>
            </svg>
          </label>
        </div>
      </nav>
    </aside>
  )
}
