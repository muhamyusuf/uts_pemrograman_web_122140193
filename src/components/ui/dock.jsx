import { SunMoon } from "lucide-react";

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/core/dock";
import { Link } from "react-router";

const data = [
  {
    title: "The Pokemon's",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-pokeball h-full w-full text-neutral-600 dark:text-neutral-300"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M3 12h6" />
        <path d="M15 12h6" />
      </svg>
    ),
    href: "/",
  },
  {
    title: "Favorites Pokemon",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-device-ipad-heart h-full w-full text-neutral-600 dark:text-neutral-300"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M11.5 21h-5.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v6" />
        <path d="M9 18h1" />
        <path d="M18 22l3.35 -3.284a2.143 2.143 0 0 0 .005 -3.071a2.242 2.242 0 0 0 -3.129 -.006l-.224 .22l-.223 -.22a2.242 2.242 0 0 0 -3.128 -.006a2.143 2.143 0 0 0 -.006 3.071l3.355 3.296z" />
      </svg>
    ),
    href: "/favorites",
  },
  {
    title: "Try Battle Pokemon",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-swords h-full w-full text-neutral-600 dark:text-neutral-300"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M21 3v5l-11 9l-4 4l-3 -3l4 -4l9 -11z" />
        <path d="M5 13l6 6" />
        <path d="M14.32 17.32l3.68 3.68l3 -3l-3.365 -3.365" />
        <path d="M10 5.5l-2 -2.5h-5v5l3 2.5" />
      </svg>
    ),
    href: "/battle-pokemon",
  },
  // {
  //   title: "Theme",
  //   icon: (
  //     <SunMoon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
  //   ),
  //   href: "#",
  // },
];

export function AppleStyleDock() {
  return (
    <div className="fixed bottom-2 left-1/2 max-w-full -translate-x-1/2">
      <Dock className="items-end pb-3">
        {data.map((item) =>
          item.href ? (
            <Link key={item.title} to={item.href}>
              <DockItem className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800">
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>{item.icon}</DockIcon>
              </DockItem>
            </Link>
          ) : (
            <DockItem
              key={item.title}
              className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800"
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          )
        )}
      </Dock>
    </div>
  );
}
