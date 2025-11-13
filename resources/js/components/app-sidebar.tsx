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
import { BookKey, BookOpen, Folder, LayoutGrid, Users, Calendar } from 'lucide-react';
import AppLogo from './app-logo';
import { Index } from '@/routes/usuarios';
import rol from '@/routes/rol';
import permisos from '@/routes/permisos';
import aula from '@/routes/aula';
import grupos from '@/routes/grupos';
import docentes from '@/routes/docentes';
import materias from '@/routes/materias';
import inventario from '@/routes/inventario';
import periodosAcademicos from '@/routes/periodos-academicos';
import bloquesHorarios from '@/routes/bloques-horarios';
import asignaciones from '@/routes/asignaciones';
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
        title: 'Gestion Academica',
        href: aula.Index().url,
        icon: BookKey,
        children: [
            { title: "Aulas", href: aula.Index().url },
            { title: "Cursos", href: "#" },
            { title: "Asignaturas", href: "#" },
            {
                title: 'Materias',
                href: materias.index().url
            },
            {
                title: 'Grupos',
                href: grupos.index().url
            },
            {
                title: 'Docentes',
                href: docentes.index().url
            },
            {
                title: 'Inventario',
                href: inventario.index().url
            },
            {
                title: 'Períodos Académicos',
                href: periodosAcademicos.index().url,
                icon: Calendar
            },
            {
                title: 'Bloque Horarios',
                href: bloquesHorarios.index().url,
            },
            {
                title: 'Asignaciones',
                href:asignaciones.index().url,
            }
        ],
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
