import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\UserController::Index
 * @see app/Http/Controllers/UserController.php:18
 * @route '/usuarios'
 */
export const Index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Index.url(options),
    method: 'get',
})

Index.definition = {
    methods: ["get","head"],
    url: '/usuarios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::Index
 * @see app/Http/Controllers/UserController.php:18
 * @route '/usuarios'
 */
Index.url = (options?: RouteQueryOptions) => {
    return Index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::Index
 * @see app/Http/Controllers/UserController.php:18
 * @route '/usuarios'
 */
Index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::Index
 * @see app/Http/Controllers/UserController.php:18
 * @route '/usuarios'
 */
Index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserController::Index
 * @see app/Http/Controllers/UserController.php:18
 * @route '/usuarios'
 */
    const IndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserController::Index
 * @see app/Http/Controllers/UserController.php:18
 * @route '/usuarios'
 */
        IndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserController::Index
 * @see app/Http/Controllers/UserController.php:18
 * @route '/usuarios'
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
* @see \App\Http\Controllers\UserController::Create
 * @see app/Http/Controllers/UserController.php:64
 * @route '/usuarios/create'
 */
export const Create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Create.url(options),
    method: 'get',
})

Create.definition = {
    methods: ["get","head"],
    url: '/usuarios/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::Create
 * @see app/Http/Controllers/UserController.php:64
 * @route '/usuarios/create'
 */
Create.url = (options?: RouteQueryOptions) => {
    return Create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::Create
 * @see app/Http/Controllers/UserController.php:64
 * @route '/usuarios/create'
 */
Create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::Create
 * @see app/Http/Controllers/UserController.php:64
 * @route '/usuarios/create'
 */
Create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserController::Create
 * @see app/Http/Controllers/UserController.php:64
 * @route '/usuarios/create'
 */
    const CreateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserController::Create
 * @see app/Http/Controllers/UserController.php:64
 * @route '/usuarios/create'
 */
        CreateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserController::Create
 * @see app/Http/Controllers/UserController.php:64
 * @route '/usuarios/create'
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
* @see \App\Http\Controllers\UserController::store
 * @see app/Http/Controllers/UserController.php:83
 * @route '/usuarios'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/usuarios',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserController::store
 * @see app/Http/Controllers/UserController.php:83
 * @route '/usuarios'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::store
 * @see app/Http/Controllers/UserController.php:83
 * @route '/usuarios'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\UserController::store
 * @see app/Http/Controllers/UserController.php:83
 * @route '/usuarios'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserController::store
 * @see app/Http/Controllers/UserController.php:83
 * @route '/usuarios'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\UserController::Editar
 * @see app/Http/Controllers/UserController.php:106
 * @route '/usuarios/editar/{user}'
 */
export const Editar = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Editar.url(args, options),
    method: 'get',
})

Editar.definition = {
    methods: ["get","head"],
    url: '/usuarios/editar/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::Editar
 * @see app/Http/Controllers/UserController.php:106
 * @route '/usuarios/editar/{user}'
 */
Editar.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return Editar.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::Editar
 * @see app/Http/Controllers/UserController.php:106
 * @route '/usuarios/editar/{user}'
 */
Editar.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Editar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::Editar
 * @see app/Http/Controllers/UserController.php:106
 * @route '/usuarios/editar/{user}'
 */
Editar.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Editar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserController::Editar
 * @see app/Http/Controllers/UserController.php:106
 * @route '/usuarios/editar/{user}'
 */
    const EditarForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Editar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserController::Editar
 * @see app/Http/Controllers/UserController.php:106
 * @route '/usuarios/editar/{user}'
 */
        EditarForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Editar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserController::Editar
 * @see app/Http/Controllers/UserController.php:106
 * @route '/usuarios/editar/{user}'
 */
        EditarForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\UserController::Update
 * @see app/Http/Controllers/UserController.php:134
 * @route '/usuarios/{user}'
 */
export const Update = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: Update.url(args, options),
    method: 'put',
})

Update.definition = {
    methods: ["put"],
    url: '/usuarios/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\UserController::Update
 * @see app/Http/Controllers/UserController.php:134
 * @route '/usuarios/{user}'
 */
Update.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return Update.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::Update
 * @see app/Http/Controllers/UserController.php:134
 * @route '/usuarios/{user}'
 */
Update.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: Update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\UserController::Update
 * @see app/Http/Controllers/UserController.php:134
 * @route '/usuarios/{user}'
 */
    const UpdateForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: Update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserController::Update
 * @see app/Http/Controllers/UserController.php:134
 * @route '/usuarios/{user}'
 */
        UpdateForm.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\UserController::Destroy
 * @see app/Http/Controllers/UserController.php:162
 * @route '/usuarios/{user}'
 */
export const Destroy = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: Destroy.url(args, options),
    method: 'delete',
})

Destroy.definition = {
    methods: ["delete"],
    url: '/usuarios/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserController::Destroy
 * @see app/Http/Controllers/UserController.php:162
 * @route '/usuarios/{user}'
 */
Destroy.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return Destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::Destroy
 * @see app/Http/Controllers/UserController.php:162
 * @route '/usuarios/{user}'
 */
Destroy.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: Destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\UserController::Destroy
 * @see app/Http/Controllers/UserController.php:162
 * @route '/usuarios/{user}'
 */
    const DestroyForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: Destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserController::Destroy
 * @see app/Http/Controllers/UserController.php:162
 * @route '/usuarios/{user}'
 */
        DestroyForm.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: Destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    Destroy.form = DestroyForm
const usuarios = {
    Index: Object.assign(Index, Index),
Create: Object.assign(Create, Create),
store: Object.assign(store, store),
Editar: Object.assign(Editar, Editar),
Update: Object.assign(Update, Update),
Destroy: Object.assign(Destroy, Destroy),
}

export default usuarios