import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn, resolveUrl } from "@/lib/utils";
import { type NavItem } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isOpen = openMenus[item.title];
                    const isActive = page.url.startsWith(resolveUrl(item.href || ""));

                    return (
                        <SidebarMenuItem key={item.title}>
                            {/* Para items CON hijos: NO usar asChild, manejar el click directamente */}
                            {hasChildren ? (
                                <SidebarMenuButton
                                    isActive={isActive}
                                    tooltip={{ children: item.title }}
                                    onClick={() => toggleMenu(item.title)}
                                    className="flex items-center w-full cursor-pointer"
                                >
                                    {item.icon && <item.icon className="mr-2" />}
                                    <span className="flex-1 text-left">{item.title}</span>
                                    {isOpen ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                </SidebarMenuButton>
                            ) : (
                                // Para items SIN hijos: usar asChild con Link
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={page.url.startsWith(
                                            resolveUrl(item.href),
                                        )}
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}

                            {hasChildren && isOpen && (
                                <SidebarMenuSub>
                                    {item.children?.map((sub) => (
                                        <SidebarMenuSubItem key={sub.title}>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={page.url.startsWith(resolveUrl(sub.href))}
                                            >
                                                <Link href={sub.href} prefetch>
                                                    <span>{sub.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}