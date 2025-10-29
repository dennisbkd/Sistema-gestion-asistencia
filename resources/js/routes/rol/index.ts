import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\RoleController::Index
 * @see app/Http/Controllers/RoleController.php:14
 * @route '/rol'
 */
export const Index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Index.url(options),
    method: 'get',
})

Index.definition = {
    methods: ["get","head"],
    url: '/rol',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoleController::Index
 * @see app/Http/Controllers/RoleController.php:14
 * @route '/rol'
 */
Index.url = (options?: RouteQueryOptions) => {
    return Index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::Index
 * @see app/Http/Controllers/RoleController.php:14
 * @route '/rol'
 */
Index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoleController::Index
 * @see app/Http/Controllers/RoleController.php:14
 * @route '/rol'
 */
Index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoleController::Index
 * @see app/Http/Controllers/RoleController.php:14
 * @route '/rol'
 */
    const IndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoleController::Index
 * @see app/Http/Controllers/RoleController.php:14
 * @route '/rol'
 */
        IndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoleController::Index
 * @see app/Http/Controllers/RoleController.php:14
 * @route '/rol'
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
* @see \App\Http\Controllers\RoleController::Editar
 * @see app/Http/Controllers/RoleController.php:102
 * @route '/rol/edit/{role}'
 */
export const Editar = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Editar.url(args, options),
    method: 'get',
})

Editar.definition = {
    methods: ["get","head"],
    url: '/rol/edit/{role}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoleController::Editar
 * @see app/Http/Controllers/RoleController.php:102
 * @route '/rol/edit/{role}'
 */
Editar.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return Editar.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::Editar
 * @see app/Http/Controllers/RoleController.php:102
 * @route '/rol/edit/{role}'
 */
Editar.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Editar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoleController::Editar
 * @see app/Http/Controllers/RoleController.php:102
 * @route '/rol/edit/{role}'
 */
Editar.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Editar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoleController::Editar
 * @see app/Http/Controllers/RoleController.php:102
 * @route '/rol/edit/{role}'
 */
    const EditarForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Editar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoleController::Editar
 * @see app/Http/Controllers/RoleController.php:102
 * @route '/rol/edit/{role}'
 */
        EditarForm.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Editar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoleController::Editar
 * @see app/Http/Controllers/RoleController.php:102
 * @route '/rol/edit/{role}'
 */
        EditarForm.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\RoleController::Update
 * @see app/Http/Controllers/RoleController.php:130
 * @route '/rol/{role}'
 */
export const Update = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: Update.url(args, options),
    method: 'put',
})

Update.definition = {
    methods: ["put"],
    url: '/rol/{role}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\RoleController::Update
 * @see app/Http/Controllers/RoleController.php:130
 * @route '/rol/{role}'
 */
Update.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return Update.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::Update
 * @see app/Http/Controllers/RoleController.php:130
 * @route '/rol/{role}'
 */
Update.put = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: Update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\RoleController::Update
 * @see app/Http/Controllers/RoleController.php:130
 * @route '/rol/{role}'
 */
    const UpdateForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: Update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoleController::Update
 * @see app/Http/Controllers/RoleController.php:130
 * @route '/rol/{role}'
 */
        UpdateForm.put = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\RoleController::Create
 * @see app/Http/Controllers/RoleController.php:50
 * @route '/rol/create'
 */
export const Create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Create.url(options),
    method: 'get',
})

Create.definition = {
    methods: ["get","head"],
    url: '/rol/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoleController::Create
 * @see app/Http/Controllers/RoleController.php:50
 * @route '/rol/create'
 */
Create.url = (options?: RouteQueryOptions) => {
    return Create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::Create
 * @see app/Http/Controllers/RoleController.php:50
 * @route '/rol/create'
 */
Create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoleController::Create
 * @see app/Http/Controllers/RoleController.php:50
 * @route '/rol/create'
 */
Create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoleController::Create
 * @see app/Http/Controllers/RoleController.php:50
 * @route '/rol/create'
 */
    const CreateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoleController::Create
 * @see app/Http/Controllers/RoleController.php:50
 * @route '/rol/create'
 */
        CreateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoleController::Create
 * @see app/Http/Controllers/RoleController.php:50
 * @route '/rol/create'
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
* @see \App\Http\Controllers\RoleController::Store
 * @see app/Http/Controllers/RoleController.php:69
 * @route '/rol'
 */
export const Store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: Store.url(options),
    method: 'post',
})

Store.definition = {
    methods: ["post"],
    url: '/rol',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RoleController::Store
 * @see app/Http/Controllers/RoleController.php:69
 * @route '/rol'
 */
Store.url = (options?: RouteQueryOptions) => {
    return Store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::Store
 * @see app/Http/Controllers/RoleController.php:69
 * @route '/rol'
 */
Store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: Store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RoleController::Store
 * @see app/Http/Controllers/RoleController.php:69
 * @route '/rol'
 */
    const StoreForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: Store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoleController::Store
 * @see app/Http/Controllers/RoleController.php:69
 * @route '/rol'
 */
        StoreForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: Store.url(options),
            method: 'post',
        })
    
    Store.form = StoreForm
/**
* @see \App\Http\Controllers\RoleController::Destroy
 * @see app/Http/Controllers/RoleController.php:157
 * @route '/rol/{role}'
 */
export const Destroy = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: Destroy.url(args, options),
    method: 'delete',
})

Destroy.definition = {
    methods: ["delete"],
    url: '/rol/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RoleController::Destroy
 * @see app/Http/Controllers/RoleController.php:157
 * @route '/rol/{role}'
 */
Destroy.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return Destroy.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::Destroy
 * @see app/Http/Controllers/RoleController.php:157
 * @route '/rol/{role}'
 */
Destroy.delete = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: Destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\RoleController::Destroy
 * @see app/Http/Controllers/RoleController.php:157
 * @route '/rol/{role}'
 */
    const DestroyForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: Destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoleController::Destroy
 * @see app/Http/Controllers/RoleController.php:157
 * @route '/rol/{role}'
 */
        DestroyForm.delete = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: Destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    Destroy.form = DestroyForm
/**
* @see \App\Http\Controllers\RoleController::BulkDestroy
 * @see app/Http/Controllers/RoleController.php:171
 * @route '/rol/bulk-delete'
 */
export const BulkDestroy = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: BulkDestroy.url(options),
    method: 'post',
})

BulkDestroy.definition = {
    methods: ["post"],
    url: '/rol/bulk-delete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RoleController::BulkDestroy
 * @see app/Http/Controllers/RoleController.php:171
 * @route '/rol/bulk-delete'
 */
BulkDestroy.url = (options?: RouteQueryOptions) => {
    return BulkDestroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::BulkDestroy
 * @see app/Http/Controllers/RoleController.php:171
 * @route '/rol/bulk-delete'
 */
BulkDestroy.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: BulkDestroy.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RoleController::BulkDestroy
 * @see app/Http/Controllers/RoleController.php:171
 * @route '/rol/bulk-delete'
 */
    const BulkDestroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: BulkDestroy.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoleController::BulkDestroy
 * @see app/Http/Controllers/RoleController.php:171
 * @route '/rol/bulk-delete'
 */
        BulkDestroyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: BulkDestroy.url(options),
            method: 'post',
        })
    
    BulkDestroy.form = BulkDestroyForm
const rol = {
    Index: Object.assign(Index, Index),
Editar: Object.assign(Editar, Editar),
Update: Object.assign(Update, Update),
Create: Object.assign(Create, Create),
Store: Object.assign(Store, Store),
Destroy: Object.assign(Destroy, Destroy),
BulkDestroy: Object.assign(BulkDestroy, BulkDestroy),
}

export default rol