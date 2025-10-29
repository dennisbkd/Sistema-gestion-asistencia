import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AulaController::Index
 * @see app/Http/Controllers/AulaController.php:11
 * @route '/aula'
 */
export const Index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Index.url(options),
    method: 'get',
})

Index.definition = {
    methods: ["get","head"],
    url: '/aula',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AulaController::Index
 * @see app/Http/Controllers/AulaController.php:11
 * @route '/aula'
 */
Index.url = (options?: RouteQueryOptions) => {
    return Index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AulaController::Index
 * @see app/Http/Controllers/AulaController.php:11
 * @route '/aula'
 */
Index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AulaController::Index
 * @see app/Http/Controllers/AulaController.php:11
 * @route '/aula'
 */
Index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AulaController::Index
 * @see app/Http/Controllers/AulaController.php:11
 * @route '/aula'
 */
    const IndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AulaController::Index
 * @see app/Http/Controllers/AulaController.php:11
 * @route '/aula'
 */
        IndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AulaController::Index
 * @see app/Http/Controllers/AulaController.php:11
 * @route '/aula'
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
* @see \App\Http\Controllers\AulaController::Create
 * @see app/Http/Controllers/AulaController.php:20
 * @route '/aula/create'
 */
export const Create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Create.url(options),
    method: 'get',
})

Create.definition = {
    methods: ["get","head"],
    url: '/aula/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AulaController::Create
 * @see app/Http/Controllers/AulaController.php:20
 * @route '/aula/create'
 */
Create.url = (options?: RouteQueryOptions) => {
    return Create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AulaController::Create
 * @see app/Http/Controllers/AulaController.php:20
 * @route '/aula/create'
 */
Create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AulaController::Create
 * @see app/Http/Controllers/AulaController.php:20
 * @route '/aula/create'
 */
Create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AulaController::Create
 * @see app/Http/Controllers/AulaController.php:20
 * @route '/aula/create'
 */
    const CreateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AulaController::Create
 * @see app/Http/Controllers/AulaController.php:20
 * @route '/aula/create'
 */
        CreateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AulaController::Create
 * @see app/Http/Controllers/AulaController.php:20
 * @route '/aula/create'
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
* @see \App\Http\Controllers\AulaController::Store
 * @see app/Http/Controllers/AulaController.php:25
 * @route '/aula'
 */
export const Store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: Store.url(options),
    method: 'post',
})

Store.definition = {
    methods: ["post"],
    url: '/aula',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AulaController::Store
 * @see app/Http/Controllers/AulaController.php:25
 * @route '/aula'
 */
Store.url = (options?: RouteQueryOptions) => {
    return Store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AulaController::Store
 * @see app/Http/Controllers/AulaController.php:25
 * @route '/aula'
 */
Store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: Store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AulaController::Store
 * @see app/Http/Controllers/AulaController.php:25
 * @route '/aula'
 */
    const StoreForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: Store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AulaController::Store
 * @see app/Http/Controllers/AulaController.php:25
 * @route '/aula'
 */
        StoreForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: Store.url(options),
            method: 'post',
        })
    
    Store.form = StoreForm
/**
* @see \App\Http\Controllers\AulaController::Show
 * @see app/Http/Controllers/AulaController.php:40
 * @route '/aula/{classroom}'
 */
export const Show = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Show.url(args, options),
    method: 'get',
})

Show.definition = {
    methods: ["get","head"],
    url: '/aula/{classroom}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AulaController::Show
 * @see app/Http/Controllers/AulaController.php:40
 * @route '/aula/{classroom}'
 */
Show.url = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { classroom: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { classroom: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    classroom: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        classroom: typeof args.classroom === 'object'
                ? args.classroom.id
                : args.classroom,
                }

    return Show.definition.url
            .replace('{classroom}', parsedArgs.classroom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AulaController::Show
 * @see app/Http/Controllers/AulaController.php:40
 * @route '/aula/{classroom}'
 */
Show.get = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AulaController::Show
 * @see app/Http/Controllers/AulaController.php:40
 * @route '/aula/{classroom}'
 */
Show.head = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AulaController::Show
 * @see app/Http/Controllers/AulaController.php:40
 * @route '/aula/{classroom}'
 */
    const ShowForm = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AulaController::Show
 * @see app/Http/Controllers/AulaController.php:40
 * @route '/aula/{classroom}'
 */
        ShowForm.get = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AulaController::Show
 * @see app/Http/Controllers/AulaController.php:40
 * @route '/aula/{classroom}'
 */
        ShowForm.head = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Show.form = ShowForm
/**
* @see \App\Http\Controllers\AulaController::Edit
 * @see app/Http/Controllers/AulaController.php:47
 * @route '/aula/edit/{classroom}'
 */
export const Edit = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Edit.url(args, options),
    method: 'get',
})

Edit.definition = {
    methods: ["get","head"],
    url: '/aula/edit/{classroom}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AulaController::Edit
 * @see app/Http/Controllers/AulaController.php:47
 * @route '/aula/edit/{classroom}'
 */
Edit.url = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { classroom: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { classroom: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    classroom: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        classroom: typeof args.classroom === 'object'
                ? args.classroom.id
                : args.classroom,
                }

    return Edit.definition.url
            .replace('{classroom}', parsedArgs.classroom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AulaController::Edit
 * @see app/Http/Controllers/AulaController.php:47
 * @route '/aula/edit/{classroom}'
 */
Edit.get = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AulaController::Edit
 * @see app/Http/Controllers/AulaController.php:47
 * @route '/aula/edit/{classroom}'
 */
Edit.head = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AulaController::Edit
 * @see app/Http/Controllers/AulaController.php:47
 * @route '/aula/edit/{classroom}'
 */
    const EditForm = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AulaController::Edit
 * @see app/Http/Controllers/AulaController.php:47
 * @route '/aula/edit/{classroom}'
 */
        EditForm.get = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AulaController::Edit
 * @see app/Http/Controllers/AulaController.php:47
 * @route '/aula/edit/{classroom}'
 */
        EditForm.head = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Edit.form = EditForm
/**
* @see \App\Http\Controllers\AulaController::Update
 * @see app/Http/Controllers/AulaController.php:54
 * @route '/aula/{classroom}'
 */
export const Update = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: Update.url(args, options),
    method: 'put',
})

Update.definition = {
    methods: ["put"],
    url: '/aula/{classroom}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AulaController::Update
 * @see app/Http/Controllers/AulaController.php:54
 * @route '/aula/{classroom}'
 */
Update.url = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { classroom: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { classroom: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    classroom: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        classroom: typeof args.classroom === 'object'
                ? args.classroom.id
                : args.classroom,
                }

    return Update.definition.url
            .replace('{classroom}', parsedArgs.classroom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AulaController::Update
 * @see app/Http/Controllers/AulaController.php:54
 * @route '/aula/{classroom}'
 */
Update.put = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: Update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AulaController::Update
 * @see app/Http/Controllers/AulaController.php:54
 * @route '/aula/{classroom}'
 */
    const UpdateForm = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: Update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AulaController::Update
 * @see app/Http/Controllers/AulaController.php:54
 * @route '/aula/{classroom}'
 */
        UpdateForm.put = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AulaController::Destroy
 * @see app/Http/Controllers/AulaController.php:69
 * @route '/aula/{classroom}'
 */
export const Destroy = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: Destroy.url(args, options),
    method: 'delete',
})

Destroy.definition = {
    methods: ["delete"],
    url: '/aula/{classroom}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AulaController::Destroy
 * @see app/Http/Controllers/AulaController.php:69
 * @route '/aula/{classroom}'
 */
Destroy.url = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { classroom: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { classroom: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    classroom: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        classroom: typeof args.classroom === 'object'
                ? args.classroom.id
                : args.classroom,
                }

    return Destroy.definition.url
            .replace('{classroom}', parsedArgs.classroom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AulaController::Destroy
 * @see app/Http/Controllers/AulaController.php:69
 * @route '/aula/{classroom}'
 */
Destroy.delete = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: Destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AulaController::Destroy
 * @see app/Http/Controllers/AulaController.php:69
 * @route '/aula/{classroom}'
 */
    const DestroyForm = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: Destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AulaController::Destroy
 * @see app/Http/Controllers/AulaController.php:69
 * @route '/aula/{classroom}'
 */
        DestroyForm.delete = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: Destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    Destroy.form = DestroyForm
const aula = {
    Index: Object.assign(Index, Index),
Create: Object.assign(Create, Create),
Store: Object.assign(Store, Store),
Show: Object.assign(Show, Show),
Edit: Object.assign(Edit, Edit),
Update: Object.assign(Update, Update),
Destroy: Object.assign(Destroy, Destroy),
}

export default aula