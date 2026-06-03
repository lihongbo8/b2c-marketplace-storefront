import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import footerLinks from "@/data/footerLinks"

export function Footer() {
  return (
    <footer className="bg-primary container" data-testid="footer">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="p-6 border rounded-sm" data-testid="footer-customer-services">
          <h2 className="heading-sm text-primary mb-3 uppercase">
            服务
          </h2>
          <nav className="space-y-3" aria-label="服务导航">
            {footerLinks.customerServices.map(({ label, path }) => (
              <LocalizedClientLink
                key={label}
                href={path}
                className="block label-md"
                data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {label}
              </LocalizedClientLink>
            ))}
          </nav>
        </div>

        <div className="p-6 border rounded-sm" data-testid="footer-about">
          <h2 className="heading-sm text-primary mb-3 uppercase">关于</h2>
          <nav className="space-y-3" aria-label="关于导航">
            {footerLinks.about.map(({ label, path }) => (
              <LocalizedClientLink
                key={label}
                href={path}
                className="block label-md"
                data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {label}
              </LocalizedClientLink>
            ))}
          </nav>
        </div>

        <div className="p-6 border rounded-sm" data-testid="footer-connect">
          <h2 className="heading-sm text-primary mb-3 uppercase">入口</h2>
          <nav className="space-y-3" aria-label="入口导航">
            {footerLinks.connect.map(({ label, path }) => (
              <a
                aria-label={label}
                title={label}
                key={label}
                href={path}
                className="block label-md"
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="py-6 border rounded-sm " data-testid="footer-copyright">
        <p className="text-md text-secondary text-center ">© 2026 迭界AI</p>
      </div>
    </footer>
  )
}
