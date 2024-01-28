const Permission = {
    Dashboard: {
        //only admin can add, edit, delete in dashboard
        canAdd: ['Admin'],
        canEdit: ['Admin'],
        canView: ['Admin'],
        canDelete: ['Admin'],

    },
    Forms: {
        canAdd: ['Community and Gender Development'],
        canEdit: ['Community and Gender Development'],
        canView: ['Community and Gender Development'],
        canDelete: ['Community and Gender Development'],
    },
    Users: {
        canAdd: ['Finance', 'Human Resources'],
        canEdit: [],
        canView: ['Finance', 'Human Resources'],
    },
    Inventories: {
        canAdd: ['Finance', 'Human Resources'],
        canEdit: ['Finance', 'Human Resources'],
        canView: ['Finance', 'Human Resources'],
        canDelete: ['Finance', 'Human Resources'],
    },
}

export default Permission;