import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PermisoController::Index
 * @see app/Http/Controllers/PermisoController.php:11
 * @route '/permisos'
 */
export const Index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Index.url(options),
    method: 'get',
})

Index.definition = {
    methods: ["get","head"],
    url: '/permisos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermisoController::Index
 * @see app/Http/Controllers/PermisoController.php:11
 * @route '/permisos'
 */
Index.url = (options?: RouteQueryOptions) => {
    return Index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermisoController::Index
 * @see app/Http/Controllers/PermisoController.php:11
 * @route '/permisos'
 */
Index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermisoController::Index
 * @see app/Http/Controllers/PermisoController.php:11
 * @route '/permisos'
 */
Index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PermisoController::Index
 * @see app/Http/Controllers/PermisoController.php:11
 * @route '/permisos'
 */
    const IndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PermisoController::Index
 * @see app/Http/Controllers/PermisoController.php:11
 * @route '/permisos'
 */
        IndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PermisoController::Index
 * @see app/Http/Controllers/PermisoController.php:11
 * @route '/permisos'
 */
        IndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Index.form = IndexForm
/**
* @see \App\Http\Controllers\PermisoController::Create
 * @see app/Http/Controllers/PermisoController.php:36
 * @route '/permisos/create'
 */
export const Create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Create.url(options),
    method: 'get',
})

Create.definition = {
    methods: ["get","head"],
    url: '/permisos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermisoController::Create
 * @see app/Http/Controllers/PermisoController.php:36
 * @route '/permisos/create'
 */
Create.url = (options?: RouteQueryOptions) => {
    return Create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermisoController::Create
 * @see app/Http/Controllers/PermisoController.php:36
 * @route '/permisos/create'
 */
Create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermisoController::Create
 * @see app/Http/Controllers/PermisoController.php:36
 * @route '/permisos/create'
 */
Create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PermisoController::Create
 * @see app/Http/Controllers/PermisoController.php:36
 * @route '/permisos/create'
 */
    const CreateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PermisoController::Create
 * @see app/Http/Controllers/PermisoController.php:36
 * @route '/permisos/create'
 */
        CreateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PermisoController::Create
 * @see app/Http/Controllers/PermisoController.php:36
 * @route '/permisos/create'
 */
        CreateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Create.form = CreateForm
/**
* @see \App\Http\Controllers\PermisoController::Store
 * @see app/Http/Controllers/PermisoController.php:41
 * @route '/permisos'
 */
export const Store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: Store.url(options),
    method: 'post',
})

Store.definition = {
    methods: ["post"],
    url: '/permisos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PermisoController::Store
 * @see app/Http/Controllers/PermisoController.php:41
 * @route '/permisos'
 */
Store.url = (options?: RouteQueryOptions) => {
    return Store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermisoController::Store
 * @see app/Http/Controllers/PermisoController.php:41
 * @route '/permisos'
 */
Store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: Store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PermisoController::Store
 * @see app/Http/Controllers/PermisoController.php:41
 * @route '/permisos'
 */
    const StoreForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: Store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PermisoController::Store
 * @see app/Http/Controllers/PermisoController.php:41
 * @route '/permisos'
 */
        StoreForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: Store.url(options),
            method: 'post',
        })
    
    Store.form = StoreForm
/**
* @see \App\Http\Controllers\PermisoController::Editar
 * @see app/Http/Controllers/PermisoController.php:54
 * @route '/permisos/edit/{permission}'
 */
export const Editar = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Editar.url(args, options),
    method: 'get',
})

Editar.definition = {
    methods: ["get","head"],
    url: '/permisos/edit/{permission}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermisoController::Editar
 * @see app/Http/Controllers/PermisoController.php:54
 * @route '/permisos/edit/{permission}'
 */
Editar.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { permission: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    permission: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        permission: typeof args.permission === 'object'
                ? args.permission.id
                : args.permission,
                }

    return Editar.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermisoController::Editar
 * @see app/Http/Controllers/PermisoController.php:54
 * @route '/permisos/edit/{permission}'
 */
Editar.get = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Editar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermisoController::Editar
 * @see app/Http/Controllers/PermisoController.php:54
 * @route '/permisos/edit/{permission}'
 */
Editar.head = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Editar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PermisoController::Editar
 * @see app/Http/Controllers/PermisoController.php:54
 * @route '/permisos/edit/{permission}'
 */
    const EditarForm = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Editar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PermisoController::Editar
 * @see app/Http/Controllers/PermisoController.php:54
 * @route '/permisos/edit/{permission}'
 */
        EditarForm.get = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Editar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PermisoController::Editar
 * @see app/Http/Controllers/PermisoController.php:54
 * @route '/permisos/edit/{permission}'
 */
        EditarForm.head = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Editar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Editar.form = EditarForm
/**
* @see \App\Http\Controllers\PermisoController::Update
 * @see app/Http/Controllers/PermisoController.php:77
 * @route '/permisos/{permission}'
 */
export const Update = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: Update.url(args, options),
    method: 'put',
})

Update.definition = {
    methods: ["put"],
    url: '/permisos/{permission}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PermisoController::Update
 * @see app/Http/Controllers/PermisoController.php:77
 * @route '/permisos/{permission}'
 */
Update.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { permission: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    permission: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        permission: typeof args.permission === 'object'
                ? args.permission.id
                : args.permission,
                }

    return Update.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermisoController::Update
 * @see app/Http/Controllers/PermisoController.php:77
 * @route '/permisos/{permission}'
 */
Update.put = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: Update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PermisoController::Update
 * @see app/Http/Controllers/PermisoController.php:77
 * @route '/permisos/{permission}'
 */
    const UpdateForm = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: Update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PermisoController::Update
 * @see app/Http/Controllers/PermisoController.php:77
 * @route '/permisos/{permission}'
 */
        UpdateForm.put = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: Update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    Update.form = UpdateForm
/**
* @see \App\Http\Controllers\PermisoController::Destroy
 * @see app/Http/Controllers/PermisoController.php:90
 * @route '/permisos/{permission}'
 */
export const Destroy = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: Destroy.url(args, options),
    method: 'delete',
})

Destroy.definition = {
    methods: ["delete"],
    url: '/permisos/{permission}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PermisoController::Destroy
 * @see app/Http/Controllers/PermisoController.php:90
 * @route '/permisos/{permission}'
 */
Destroy.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { permission: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    permission: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        permission: typeof args.permission === 'object'
                ? args.permission.id
                : args.permission,
                }

    return Destroy.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermisoController::Destroy
 * @see app/Http/Controllers/PermisoController.php:90
 * @route '/permisos/{permission}'
 */
Destroy.delete = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: Destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PermisoController::Destroy
 * @see app/Http/Controllers/PermisoController.php:90
 * @route '/permisos/{permission}'
 */
    const DestroyForm = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: Destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PermisoController::Destroy
 * @see app/Http/Controllers/PermisoController.php:90
 * @route '/permisos/{permission}'
 */
        DestroyForm.delete = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: Destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    Destroy.form = DestroyForm
const permisos = {
    Index: Object.assign(Index, Index),
Create: Object.assign(Create, Create),
Store: Object.assign(Store, Store),
Editar: Object.assign(Editar, Editar),
Update: Object.assign(Update, Update),
Destroy: Object.assign(Destroy, Destroy),
}

export default permisos