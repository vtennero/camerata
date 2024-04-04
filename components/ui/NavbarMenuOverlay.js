import NavLink from "./NavLink";

const MenuOverlay = ({ links }) => {
  const handleClick = (action) => {
    if (action) {
      action();
    }
  };

  return (
    <ul className="flex flex-col py-4 items-center md:hidden">
      {links.map((link, index) => (
        <li key={index} onClick={() => handleClick(link.action)}>
          <NavLink href={link.path} title={link.title} />
        </li>
      ))}
    </ul>
  );
};

export default MenuOverlay;
