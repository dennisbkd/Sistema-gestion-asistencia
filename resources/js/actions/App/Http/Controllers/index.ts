import UserController from './UserController'
import RoleController from './RoleController'
import PermisoController from './PermisoController'
import AulaController from './AulaController'
import Settings from './Settings'
const Controllers = {
    UserController: Object.assign(UserController, UserController),
RoleController: Object.assign(RoleController, RoleController),
PermisoController: Object.assign(PermisoController, PermisoController),
AulaController: Object.assign(AulaController, AulaController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers