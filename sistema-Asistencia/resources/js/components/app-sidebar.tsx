import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, School } from 'lucide-react';
import AppLogo from './app-logo';
import usuarios, { Index } from '@/routes/usuarios';
import rol from '@/routes/rol';
import permisos from '@/routes/permisos';
import materias from '@/routes/materias';
import { title } from 'process';
import grupos from '@/routes/grupos';
import docentes from '@/routes/docentes';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Gestión de Usuarios',
        href: Index().url,
        icon: Users,
        children: [
            { title: "Usuarios", href: "/usuarios" },
            { title: "Bitácora", href: "/bitacora" },
            { title: "Roles", href: rol.Index().url },
            { title: "Permisos", href: permisos.Index().url },
        ],
    },
    {
        title: 'Materias',
        href: materias.index().url,
        icon: School,
    },
    {
        title: 'Grupos',
        href: grupos.index().url,
        icon: Folder,
    },
    {
        title: 'Docentes',
        href: docentes.index().url,
        icon: Users,
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
