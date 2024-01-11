const { INTERNAL_SERVER_ERROR } = require('../../../common/constants')

function groupByRole(roles) {
    try {
        const result  = {}
        roles?.reduce((acc, cv) => {
            if(!result[cv?.role?.name]) {
                result[cv?.role?.name] = {
                    id: cv?.id,
                    roleId: cv?.roleId,
                    name: cv?.role?.name,
                    permissions: {
                        exec: cv?.execute,
                        read: cv?.read,
                        write: cv?.write,
                    },
                    roles: [],
                    resources: [],
                    createdAt: cv?.createdAt,
                    updatedAt: cv?.updatedAt,
                }
            }

            if(!result[cv?.role.name]?.roles?.find((role) => role?.id === cv?.role?.id)) result[cv?.role.name].roles.push({ id: cv?.role.id, name: cv?.role.name, description: cv?.role.description })
            result[cv?.role.name].resources.push({ id: cv?.resource.id, name: cv?.resource.name, description: cv?.resource.description, level: cv?.resource.level, url: cv?.resource.url, icon: cv?.resource.icon })
        }, result)

        return Object.keys(result).map((key) => result[key], [])

    } catch (e) {
        const error = new Error(e.message)
        error.status = INTERNAL_SERVER_ERROR   
        throw error
    }
}



module.exports = {
    groupByRole
}