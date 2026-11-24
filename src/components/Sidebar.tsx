const LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#findings", label: "Key findings" },
  { href: "#timeline", label: "Timeline" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo__mark" aria-hidden="true">
          CL
        </span>
        <span className="logo__text">ClaimLens</span>
      </div>

      <nav aria-label="Case sections">
        <ul className="sidenav">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="sidebar__note">
        Demo with fictional data. Not a real claim.
      </p>
    </aside>
  );
}
