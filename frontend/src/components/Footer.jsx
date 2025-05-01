import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const SITEMAP = [
  {
    title: "Company",
    links: ["About Us", "Careers", "Our Team", "Projects"],
  },
  {
    title: "Help Center",
    links: ["Contact Us", "Become a Seller", "Support", "FAQs"],
  },
  {
    title: "Resources",
    links: ["Blog", "Newsletter", "Free Products", "Affiliate Program"],
  },
  {
    title: "Social",
    links: ["Facebook", "Instagram", "Twitter", "LinkedIn"],
  },
];

const SOCIALS = [
  { name: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { name: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { name: "Twitter", href: "https://twitter.com", icon: "twitter" },
  { name: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
];

const currentYear = new Date().getFullYear();

const resolveLinkPath = (link) => {
  switch (link) {
    case "About Us":
      return "/about";
    case "Contact Us":
      return "/contact";
    case "Become a Seller":
      return "/vendor-home";
    case "Careers":
      return "/careers";
    case "Blog":
      return "/blog";
    case "FAQs":
      return "/faq";
    default:
      return "#";
  }
};

const Footer = () => {
  return (
    <footer className="w-full bg-blue-gray-50 pt-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {SITEMAP.map(({ title, links }, key) => (
            <div key={key}>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-4 font-bold uppercase opacity-70"
              >
                {title}
              </Typography>
              <ul className="space-y-2">
                {links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={resolveLinkPath(link)}
                      className="text-blue-gray-700 hover:underline"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-blue-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <Typography color="blue-gray" className="text-sm">
            &copy; {currentYear} Bazario. All rights reserved.
          </Typography>
          <div className="flex gap-4 mt-4 sm:mt-0">
            {SOCIALS.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-blue-gray-700 hover:text-blue-500 transition"
              >
                <i className={`fab fa-${social.icon} text-lg`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
