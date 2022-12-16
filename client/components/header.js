import Link from 'next/link'

export default ({currentUser}) => {
    let links = [
        !currentUser && {label: "Sign Up", href: "/auth/signup"},
        !currentUser && {label: "Sign In", href: "/auth/signin"},
        currentUser && {label: "Sell Tickets", href: "/tickets/new"},
        currentUser && {label: "My Orders", href: "/orders"},
        currentUser && {label: "Sign Out", href: "/auth/signout"},
    ].filter(linkConfig => linkConfig)
    .map(({label, href}) => {
        return <li className='nav-item' key={href}><Link className='nav-link' href={href}>{label}</Link></li>
    })
    return (
        <nav className="navbar navbar-expand-lg bg-light mb-3">
        <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <Link className="navbar-brand" href="/">GitTik</Link>
            <div className="d-flex justify-content-end">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {links}
            </ul>
            </div>
        </div>
        </nav>
    )
}