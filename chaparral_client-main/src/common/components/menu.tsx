"use client"

import { useCallback, useEffect, useState } from "react"
import { appWindow, type WebviewWindow } from "@tauri-apps/plugin-window"
import { Globe, Maximize, Mic, Music2, Sailboat, X, Zap } from "lucide-react"

import { Button } from "@/common/components/ui/button"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/common/components/ui/menubar"

import { Icons } from "./icons"
import { MenuModeToggle } from "./menu-mode-toggle"
import { Link, useNavigate } from "react-router-dom"

export function Menu() {
  const navigate = useNavigate();
  const minimizeWindow = () => appWindow?.minimize()
  const maximizeWindow = async () => {
    if (await appWindow?.isMaximized()) {
      appWindow?.unmaximize()
    } else {
      appWindow?.maximize()
    }
  }
  const closeWindow = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('account');
    navigate('/login');
  }

  return (
    <Menubar className="rounded-none border-b border-none pl-2 lg:pl-3 bg-primary text-primary-foreground">
      {/* App Logo */}
      <MenubarMenu>
        <div className="inline-flex h-fit w-fit items-center text-cyan-500">
          <Sailboat className="h-5 w-5" />
        </div>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="font-bold">App</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>About App</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Preferences... <MenubarShortcut>⌘,</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Hide Music... <MenubarShortcut>⌘H</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Hide Others... <MenubarShortcut>⇧⌘H</MenubarShortcut>
          </MenubarItem>
          <MenubarShortcut />
          <MenubarItem onClick={closeWindow}>
            Quit Music <MenubarShortcut>⌘Q</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="relative" ><Link to="/user">Dashboard</Link></MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="relative" ><Link to="/user/project">Project</Link></MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="relative" >Organization</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link to="/organization/setting" className="w-full">
              Setting
            </Link>
          </MenubarItem>
          <MenubarItem>
            <Link to="/organization/invite" className="w-full">
              Invite
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Account</MenubarTrigger>
        <MenubarContent forceMount>
          <MenubarItem><Link to="/reset-password-normal" className="w-full">Change password</Link></MenubarItem>
          <MenubarSeparator />
          <MenubarItem className="cursor-pointer" onClick={closeWindow}>Logout</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenuModeToggle />

      <div
        data-tauri-drag-region
        className="inline-flex h-full w-full justify-end"
      >
        <Button
          onClick={minimizeWindow}
          variant="ghost"
          className="h-8 focus:outline-none"
        >
          <Icons.minimize className="h-3 w-3" />
        </Button>
        <Button
          onClick={maximizeWindow}
          variant="ghost"
          className="h-8 focus:outline-none"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        <Button
          onClick={closeWindow}
          variant="ghost"
          className="h-8 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Menubar>
  )
}
