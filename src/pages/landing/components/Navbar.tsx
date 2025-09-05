import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { buttonVariants } from "@/components/ui/button";
import { Menu, Package } from "lucide-react";
interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#testimonials",
    label: "Testimonials",
  },
  {
    href: "#pricing",
    label: "Pricing",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (

    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white  dark:border-b-slate-700 dark:bg-background" >
     {/* <Stack
      id="navigation-bar-0"
      sx={{
        zIndex: 1000,
        position: 'sticky',
        width: '100dvw',
        borderBottom: '1px solid',
        borderColor: 'divider',
       
        backgroundColor: 'background.body',
   
        top: 0,
      }}
      className="bg-background"
    > */}


      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex"
            >
              {/* <LogoIcon /> */}
              Delivery Express
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            {/* <ColorSchemeToggle sx={{
              width: "20px",
              height: "20px",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }} /> */}

            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    Shadcn/React
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                  <a
                    rel="noreferrer noopener"
                    href="/authentication/phone-login"
                    className={`w-[110px] border ${buttonVariants({
                      variant: "secondary",
                    })}`}
                  >
                    <Package className="mr-2 w-5 h-5" />
                    Track Parcel
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            <a
              href="/authentication/phone-login"
              className={`border ${buttonVariants({ variant: "secondary" })}`}
            >
              <Package className="mr-2 w-5 h-5" />
              Track Parcel
            </a>
            {/* <ColorSchemeToggle sx={{
              width: "40px",
              height: "40px",

              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }} /> */}
            {/* <ModeToggle /> */}
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      {/* </Stack> */}
      </ header>

  );
};
