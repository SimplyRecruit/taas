import axios, { AxiosResponse } from "axios"
import Cookies from "universal-cookie";
import cookieKeys from "@/constants/cookie-keys";
const lang = "en"
const routeParamRegex = /^:(\w+)$/;
// Model Imports
import { 
Client,
ClientUpdateBody,
ClientCreateBody,
ClientAddResourceBody,
Resource,
ResourceUpdateBody,
LoginReqBody,
RegisterOrganizationReqBody,
ResourceCreateBody,
ResetPasswordReqBody,
User,
TableQueryParameters,
WorkPeriod,
Project,
} from "models"

function createAxiosInstance() {
    const token = new Cookies().get(cookieKeys.COOKIE_USER_TOKEN, { doNotParse: true} )
    return axios.create({ baseURL: (process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000') + "/api", headers: { "Authorization": `Bearer ${token}`, "Accept-Language": lang } })
}

function createUrl(params: { [key: string]: string }, route: string) {
    let url = ""
    for (const block of route.substring(1).split("/")) {
        url += "/"
        const paramRegExpArray = block.match(routeParamRegex)
        if (paramRegExpArray == null) { url += block; continue }
        else url += params[`${Object.keys(params).find(p => p === paramRegExpArray[1])}`]
    }
    return url
}

export default {
    client: {
        async getAll(
        ) : Promise<AxiosResponse<Client[]>>
        {
            const route = "/client"
            const url = route
            return await createAxiosInstance().request({
                method: "get",
                url,
            })
        },
        async update(
            body: ClientUpdateBody,
            params: { id: string, },
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/client/:id"
            const url = createUrl(params, route)
            return await createAxiosInstance().request({
                method: "patch",
                url,
                data: body,
            })
        },
        async create(
            body: ClientCreateBody,
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/client"
            const url = route
            return await createAxiosInstance().request({
                method: "post",
                url,
                data: body,
            })
        },
        async delete(
            params: { id: string, },
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/client/:id"
            const url = createUrl(params, route)
            return await createAxiosInstance().request({
                method: "delete",
                url,
            })
        },
        async addResource(
            body: ClientAddResourceBody,
            params: { clientId: string, },
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/client/resource/:clientId"
            const url = createUrl(params, route)
            return await createAxiosInstance().request({
                method: "post",
                url,
                data: body,
            })
        },
        async removeResource(
            params: { resourceId: string,clientId: string, },
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/client/:clientId/resource/:resourceId"
            const url = createUrl(params, route)
            return await createAxiosInstance().request({
                method: "delete",
                url,
            })
        },
        async getResourcesOf(
            params: { id: string, },
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/client/:id/resources"
            const url = createUrl(params, route)
            return await createAxiosInstance().request({
                method: "get",
                url,
            })
        },
    },
    resource: {
        async getAll(
        ) : Promise<AxiosResponse<Resource[]>>
        {
            const route = "/resource"
            const url = route
            return await createAxiosInstance().request({
                method: "get",
                url,
            })
        },
        async update(
            body: ResourceUpdateBody,
            params: { id: string, },
        ) : Promise<AxiosResponse<string>>
        {
            const route = "/resource/:id"
            const url = createUrl(params, route)
            return await createAxiosInstance().request({
                method: "patch",
                url,
                data: body,
            })
        },
        async delete(
            params: { id: string, },
        ) : Promise<AxiosResponse<string>>
        {
            const route = "/resource/:id"
            const url = createUrl(params, route)
            return await createAxiosInstance().request({
                method: "delete",
                url,
            })
        },
        async getClients(
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/resource/clients"
            const url = route
            return await createAxiosInstance().request({
                method: "get",
                url,
            })
        },
        async getClientsOf(
            params: { id: string, },
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/resource/:id/clients"
            const url = createUrl(params, route)
            return await createAxiosInstance().request({
                method: "get",
                url,
            })
        },
        async assignClientToResource(
            params: { clientId: string,resourceId: string, },
        ) : Promise<AxiosResponse<string>>
        {
            const route = "/resource/:resourceId/clients/:clientId"
            const url = createUrl(params, route)
            return await createAxiosInstance().request({
                method: "post",
                url,
            })
        },
    },
    user: {
        async login(
            body: LoginReqBody,
        ) : Promise<AxiosResponse<string>>
        {
            const route = "/user/login"
            const url = route
            return await createAxiosInstance().request({
                method: "post",
                url,
                data: body,
            })
        },
        async registerOrganization(
            body: RegisterOrganizationReqBody,
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/user/register-organization"
            const url = route
            return await createAxiosInstance().request({
                method: "post",
                url,
                data: body,
            })
        },
        async inviteMember(
            body: ResourceCreateBody,
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/user/invite-member"
            const url = route
            return await createAxiosInstance().request({
                method: "post",
                url,
                data: body,
            })
        },
        async resetPassword(
            body: ResetPasswordReqBody,
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/user/reset-password"
            const url = route
            return await createAxiosInstance().request({
                method: "post",
                url,
                data: body,
            })
        },
        async forgotPassword(
            queries: { email: string, },
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/user/forgot-password"
            const url = route
            return await createAxiosInstance().request({
                method: "post",
                url,
                params: queries,
            })
        },
        async me(
        ) : Promise<AxiosResponse<User>>
        {
            const route = "/user/me"
            const url = route
            return await createAxiosInstance().request({
                method: "get",
                url,
            })
        },
    },
    workPeriod: {
        async getAll(
            queries: TableQueryParameters,
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/work-period"
            const url = route
            return await createAxiosInstance().request({
                method: "get",
                url,
                params: queries,
            })
        },
        async create(
            body: WorkPeriod,
        ) : Promise<AxiosResponse<string>>
        {
            const route = "/work-period"
            const url = route
            return await createAxiosInstance().request({
                method: "post",
                url,
                data: body,
            })
        },
        async delete(
            body: WorkPeriod,
        ) : Promise<AxiosResponse<string>>
        {
            const route = "/work-period"
            const url = route
            return await createAxiosInstance().request({
                method: "delete",
                url,
                data: body,
            })
        },
        async toggle(
            body: WorkPeriod,
        ) : Promise<AxiosResponse<string>>
        {
            const route = "/work-period"
            const url = route
            return await createAxiosInstance().request({
                method: "put",
                url,
                data: body,
            })
        },
    },
    project: {
        async getAll(
        ) : Promise<AxiosResponse<Project[]>>
        {
            const route = "/project"
            const url = route
            return await createAxiosInstance().request({
                method: "get",
                url,
            })
        },
    },
    
} 