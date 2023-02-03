import axios from "axios"
import { ParamMetadataArgs } from "routing-controllers/types/metadata/args/ParamMetadataArgs"
const token = ""
const lang = "en"
const httpInstance = axios.create({ baseURL: "http://localhost:3000/api", headers: { "Authorization": `Bearer ${token}`, "Accept-Language": lang } })
type methodType = 'get' | 'post' | 'patch' | 'put' | 'delete'
const apiMethods: { [key: string]: { [key: string]: { method: methodType, params: ParamMetadataArgs[] } } } = {};
const routeParamRegex = /^:(\w+)$/;

function createUrl(params: { [key: string]: string }, route: string) {
    let url = ""
    for (const block of route.substring(1).split("/")) {
        url += "/"
        const paramRegExpArray = block.match(routeParamRegex)
        if (paramRegExpArray == null) { url += block; continue }
        else url += Object.keys(params).find(p => p === paramRegExpArray[1])
    }
    return url
}

export default {
    customer: {
        async getAll(
        )
        {
            const route = "/customer"
            const url = route
            return await httpInstance.request({
                method: "get",
                url,
            })
        },
        async update(
            body: {  [key: string]: any },
            params: { id: string,  },
        )
        {
            const route = "/customer/:id"
            const url = createUrl(params, route)
            return await httpInstance.request({
                method: "patch",
                url,
                data: body,
            })
        },
        async create(
            body: {  [key: string]: any },
        )
        {
            const route = "/customer"
            const url = route
            return await httpInstance.request({
                method: "post",
                url,
                data: body,
            })
        },
        async delete(
            params: { id: string,  },
        )
        {
            const route = "/customer/:id"
            const url = createUrl(params, route)
            return await httpInstance.request({
                method: "delete",
                url,
            })
        },
        async getResourcesOf(
            params: { id: string,  },
        )
        {
            const route = "/customer/:id/resources"
            const url = createUrl(params, route)
            return await httpInstance.request({
                method: "get",
                url,
            })
        },
    },
    resource: {
        async getAll(
        )
        {
            const route = "/resource"
            const url = route
            return await httpInstance.request({
                method: "get",
                url,
            })
        },
        async update(
            body: {  [key: string]: any },
            params: { id: string,  },
        )
        {
            const route = "/resource/:id"
            const url = createUrl(params, route)
            return await httpInstance.request({
                method: "patch",
                url,
                data: body,
            })
        },
        async delete(
            params: { id: string,  },
        )
        {
            const route = "/resource/:id"
            const url = createUrl(params, route)
            return await httpInstance.request({
                method: "delete",
                url,
            })
        },
        async getCustomers(
        )
        {
            const route = "/resource/customers"
            const url = route
            return await httpInstance.request({
                method: "get",
                url,
            })
        },
        async getCustomersOf(
            params: { id: string,  },
        )
        {
            const route = "/resource/:id/customers"
            const url = createUrl(params, route)
            return await httpInstance.request({
                method: "get",
                url,
            })
        },
        async assignCustomerToResource(
            params: { customerId: string,resourceId: string,  },
        )
        {
            const route = "/resource/:resourceId/customers/:customerId"
            const url = createUrl(params, route)
            return await httpInstance.request({
                method: "post",
                url,
            })
        },
    },
    user: {
        async login(
            body: {  [key: string]: any },
        )
        {
            const route = "/user/login"
            const url = route
            return await httpInstance.request({
                method: "post",
                url,
                data: body,
            })
        },
        async registerOrganization(
            body: {  [key: string]: any },
        )
        {
            const route = "/user/register-organization"
            const url = route
            return await httpInstance.request({
                method: "post",
                url,
                data: body,
            })
        },
        async resetPassword(
        )
        {
            const route = "/user/reset-password"
            const url = route
            return await httpInstance.request({
                method: "post",
                url,
            })
        },
        async forgotPassword(
        )
        {
            const route = "/user/forgot-password"
            const url = route
            return await httpInstance.request({
                method: "post",
                url,
            })
        },
        async me(
        )
        {
            const route = "/user/me"
            const url = route
            return await httpInstance.request({
                method: "get",
                url,
            })
        },
    },
    workPeriod: {
        async getAll(
            queries: {  [key: string]: string },
        )
        {
            const route = "/work-period"
            const url = route
            return await httpInstance.request({
                method: "get",
                url,
                params: queries,
            })
        },
        async create(
            body: {  [key: string]: any },
        )
        {
            const route = "/work-period"
            const url = route
            return await httpInstance.request({
                method: "post",
                url,
                data: body,
            })
        },
        async delete(
            body: {  [key: string]: any },
        )
        {
            const route = "/work-period"
            const url = route
            return await httpInstance.request({
                method: "delete",
                url,
                data: body,
            })
        },
        async toggle(
            body: {  [key: string]: any },
        )
        {
            const route = "/work-period"
            const url = route
            return await httpInstance.request({
                method: "put",
                url,
                data: body,
            })
        },
    },
    
} 