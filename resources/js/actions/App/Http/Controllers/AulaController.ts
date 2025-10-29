import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AulaController::index
 * @see app/Http/Controllers/AulaController.php:11
 * @route '/aula'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/aula',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AulaController::index
 * @see app/Http/Controllers/AulaController.php:11
 * @route '/aula'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AulaController::index
 * @see app/Http/Controllers/AulaController.php:11
 * @route '/aula'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AulaController::index
 * @see app/Http/Controllers/AulaController.php:11
 * @route '/aula'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AulaController::index
 * @see app/Http/Controllers/AulaController.php:11
 * @route '/aula'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AulaController::index
 * @see app/Http/Controllers/AulaController.php:11
 * @route '/aula'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AulaController::index
 * @see app/Http/Controllers/AulaController.php:11
 * @route '/aula'
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
* @see \App\Http\Controllers\AulaController::create
 * @see app/Http/Controllers/AulaController.php:20
 * @route '/aula/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/aula/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AulaController::create
 * @see app/Http/Controllers/AulaController.php:20
 * @route '/aula/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AulaController::create
 * @see app/Http/Controllers/AulaController.php:20
 * @route '/aula/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AulaController::create
 * @see app/Http/Controllers/AulaController.php:20
 * @route '/aula/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AulaController::create
 * @see app/Http/Controllers/AulaController.php:20
 * @route '/aula/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AulaController::create
 * @see app/Http/Controllers/AulaController.php:20
 * @route '/aula/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AulaController::create
 * @see app/Http/Controllers/AulaController.php:20
 * @route '/aula/create'
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
* @see \App\Http\Controllers\AulaController::store
 * @see app/Http/Controllers/AulaController.php:25
 * @route '/aula'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/aula',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AulaController::store
 * @see app/Http/Controllers/AulaController.php:25
 * @route '/aula'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AulaController::store
 * @see app/Http/Controllers/AulaController.php:25
 * @route '/aula'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AulaController::store
 * @see app/Http/Controllers/AulaController.php:25
 * @route '/aula'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AulaController::store
 * @see app/Http/Controllers/AulaController.php:25
 * @route '/aula'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AulaController::show
 * @see app/Http/Controllers/AulaController.php:40
 * @route '/aula/{classroom}'
 */
export const show = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/aula/{classroom}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AulaController::show
 * @see app/Http/Controllers/AulaController.php:40
 * @route '/aula/{classroom}'
 */
show.url = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{classroom}', parsedArgs.classroom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AulaController::show
 * @see app/Http/Controllers/AulaController.php:40
 * @route '/aula/{classroom}'
 */
show.get = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AulaController::show
 * @see app/Http/Controllers/AulaController.php:40
 * @route '/aula/{classroom}'
 */
show.head = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AulaController::show
 * @see app/Http/Controllers/AulaController.php:40
 * @route '/aula/{classroom}'
 */
    const showForm = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AulaController::show
 * @see app/Http/Controllers/AulaController.php:40
 * @route '/aula/{classroom}'
 */
        showForm.get = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AulaController::show
 * @see app/Http/Controllers/AulaController.php:40
 * @route '/aula/{classroom}'
 */
        showForm.head = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\AulaController::edit
 * @see app/Http/Controllers/AulaController.php:47
 * @route '/aula/edit/{classroom}'
 */
export const edit = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/aula/edit/{classroom}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AulaController::edit
 * @see app/Http/Controllers/AulaController.php:47
 * @route '/aula/edit/{classroom}'
 */
edit.url = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{classroom}', parsedArgs.classroom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AulaController::edit
 * @see app/Http/Controllers/AulaController.php:47
 * @route '/aula/edit/{classroom}'
 */
edit.get = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AulaController::edit
 * @see app/Http/Controllers/AulaController.php:47
 * @route '/aula/edit/{classroom}'
 */
edit.head = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AulaController::edit
 * @see app/Http/Controllers/AulaController.php:47
 * @route '/aula/edit/{classroom}'
 */
    const editForm = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AulaController::edit
 * @see app/Http/Controllers/AulaController.php:47
 * @route '/aula/edit/{classroom}'
 */
        editForm.get = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AulaController::edit
 * @see app/Http/Controllers/AulaController.php:47
 * @route '/aula/edit/{classroom}'
 */
        editForm.head = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AulaController::update
 * @see app/Http/Controllers/AulaController.php:54
 * @route '/aula/{classroom}'
 */
export const update = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/aula/{classroom}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AulaController::update
 * @see app/Http/Controllers/AulaController.php:54
 * @route '/aula/{classroom}'
 */
update.url = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{classroom}', parsedArgs.classroom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AulaController::update
 * @see app/Http/Controllers/AulaController.php:54
 * @route '/aula/{classroom}'
 */
update.put = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AulaController::update
 * @see app/Http/Controllers/AulaController.php:54
 * @route '/aula/{classroom}'
 */
    const updateForm = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AulaController::update
 * @see app/Http/Controllers/AulaController.php:54
 * @route '/aula/{classroom}'
 */
        updateForm.put = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AulaController::destroy
 * @see app/Http/Controllers/AulaController.php:69
 * @route '/aula/{classroom}'
 */
export const destroy = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/aula/{classroom}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AulaController::destroy
 * @see app/Http/Controllers/AulaController.php:69
 * @route '/aula/{classroom}'
 */
destroy.url = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{classroom}', parsedArgs.classroom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AulaController::destroy
 * @see app/Http/Controllers/AulaController.php:69
 * @route '/aula/{classroom}'
 */
destroy.delete = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AulaController::destroy
 * @see app/Http/Controllers/AulaController.php:69
 * @route '/aula/{classroom}'
 */
    const destroyForm = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AulaController::destroy
 * @see app/Http/Controllers/AulaController.php:69
 * @route '/aula/{classroom}'
 */
        destroyForm.delete = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AulaController = { index, create, store, show, edit, update, destroy }

export default AulaController