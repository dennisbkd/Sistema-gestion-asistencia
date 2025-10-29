import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PermisoController::index
 * @see app/Http/Controllers/PermisoController.php:11
 * @route '/permisos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/permisos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermisoController::index
 * @see app/Http/Controllers/PermisoController.php:11
 * @route '/permisos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermisoController::index
 * @see app/Http/Controllers/PermisoController.php:11
 * @route '/permisos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermisoController::index
 * @see app/Http/Controllers/PermisoController.php:11
 * @route '/permisos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PermisoController::index
 * @see app/Http/Controllers/PermisoController.php:11
 * @route '/permisos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PermisoController::index
 * @see app/Http/Controllers/PermisoController.php:11
 * @route '/permisos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PermisoController::index
 * @see app/Http/Controllers/PermisoController.php:11
 * @route '/permisos'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\PermisoController::create
 * @see app/Http/Controllers/PermisoController.php:36
 * @route '/permisos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/permisos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermisoController::create
 * @see app/Http/Controllers/PermisoController.php:36
 * @route '/permisos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermisoController::create
 * @see app/Http/Controllers/PermisoController.php:36
 * @route '/permisos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermisoController::create
 * @see app/Http/Controllers/PermisoController.php:36
 * @route '/permisos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PermisoController::create
 * @see app/Http/Controllers/PermisoController.php:36
 * @route '/permisos/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PermisoController::create
 * @see app/Http/Controllers/PermisoController.php:36
 * @route '/permisos/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PermisoController::create
 * @see app/Http/Controllers/PermisoController.php:36
 * @route '/permisos/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\PermisoController::store
 * @see app/Http/Controllers/PermisoController.php:41
 * @route '/permisos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/permisos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PermisoController::store
 * @see app/Http/Controllers/PermisoController.php:41
 * @route '/permisos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermisoController::store
 * @see app/Http/Controllers/PermisoController.php:41
 * @route '/permisos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PermisoController::store
 * @see app/Http/Controllers/PermisoController.php:41
 * @route '/permisos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PermisoController::store
 * @see app/Http/Controllers/PermisoController.php:41
 * @route '/permisos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PermisoController::edit
 * @see app/Http/Controllers/PermisoController.php:54
 * @route '/permisos/edit/{permission}'
 */
export const edit = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/permisos/edit/{permission}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermisoController::edit
 * @see app/Http/Controllers/PermisoController.php:54
 * @route '/permisos/edit/{permission}'
 */
edit.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermisoController::edit
 * @see app/Http/Controllers/PermisoController.php:54
 * @route '/permisos/edit/{permission}'
 */
edit.get = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermisoController::edit
 * @see app/Http/Controllers/PermisoController.php:54
 * @route '/permisos/edit/{permission}'
 */
edit.head = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PermisoController::edit
 * @see app/Http/Controllers/PermisoController.php:54
 * @route '/permisos/edit/{permission}'
 */
    const editForm = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PermisoController::edit
 * @see app/Http/Controllers/PermisoController.php:54
 * @route '/permisos/edit/{permission}'
 */
        editForm.get = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PermisoController::edit
 * @see app/Http/Controllers/PermisoController.php:54
 * @route '/permisos/edit/{permission}'
 */
        editForm.head = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\PermisoController::update
 * @see app/Http/Controllers/PermisoController.php:77
 * @route '/permisos/{permission}'
 */
export const update = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/permisos/{permission}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PermisoController::update
 * @see app/Http/Controllers/PermisoController.php:77
 * @route '/permisos/{permission}'
 */
update.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermisoController::update
 * @see app/Http/Controllers/PermisoController.php:77
 * @route '/permisos/{permission}'
 */
update.put = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PermisoController::update
 * @see app/Http/Controllers/PermisoController.php:77
 * @route '/permisos/{permission}'
 */
    const updateForm = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PermisoController::update
 * @see app/Http/Controllers/PermisoController.php:77
 * @route '/permisos/{permission}'
 */
        updateForm.put = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\PermisoController::destroy
 * @see app/Http/Controllers/PermisoController.php:90
 * @route '/permisos/{permission}'
 */
export const destroy = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/permisos/{permission}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PermisoController::destroy
 * @see app/Http/Controllers/PermisoController.php:90
 * @route '/permisos/{permission}'
 */
destroy.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermisoController::destroy
 * @see app/Http/Controllers/PermisoController.php:90
 * @route '/permisos/{permission}'
 */
destroy.delete = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PermisoController::destroy
 * @see app/Http/Controllers/PermisoController.php:90
 * @route '/permisos/{permission}'
 */
    const destroyForm = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PermisoController::destroy
 * @see app/Http/Controllers/PermisoController.php:90
 * @route '/permisos/{permission}'
 */
        destroyForm.delete = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const PermisoController = { index, create, store, edit, update, destroy }

export default PermisoController