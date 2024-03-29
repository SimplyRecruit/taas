import axios, { AxiosResponse } from "axios"
import Cookies from "universal-cookie";
import cookieKeys from "@/constants/cookie-keys";
const lang = "en"
const routeParamRegex = /^:(\w+)$/;
// Model Imports
import { 
WorkPeriod,
LoginReqBody,
RegisterOrganizationReqBody,
ResourceCreateBody,
ResetPasswordReqBody,
User,
TTGetAllParams,
TTGetAllResBody,
TTUpdateBody,
TTBatchCreateBody,
TTBatchCreateResBody,
Resource,
ResourceUpdateBody,
GetClientsAndProjectsResBody,
ReportReqBody,
Report,
GetTrackerHoursReqBody,
Project,
ProjectCreateBody,
ProjectUpdateBody,
Client,
ClientUpdateBody,
ClientCreateBody,
ClientUpdateAccessBody,
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
    workPeriod: {
        async getAll(
        ) : Promise<AxiosResponse<WorkPeriod[]>>
        {
            const route = "/work-period"
            const url = route
            return await createAxiosInstance().request({
                method: "get",
                url,
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
        ) : Promise<AxiosResponse<string>>
        {
            const route = "/user/invite-member"
            const url = route
            return await createAxiosInstance().request({
                method: "post",
                url,
                data: body,
            })
        },
        async reInviteMember(
            queries: { abbr: string, },
        ) : Promise<AxiosResponse<string>>
        {
            const route = "/user/re-invite-member"
            const url = route
            return await createAxiosInstance().request({
                method: "post",
                url,
                params: queries,
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
    timeTrack: {
        async getAll(
            body: TTGetAllParams,
        ) : Promise<AxiosResponse<TTGetAllResBody>>
        {
            const route = "/time-track"
            const url = route
            return await createAxiosInstance().request({
                method: "post",
                url,
                data: body,
            })
        },
        async exportSpreadSheet(
            body: TTGetAllParams,
        ) : Promise<AxiosResponse<Blob>>
        {
            const route = "/time-track/spread-sheet"
            const url = route
            return await createAxiosInstance().request({
                method: "post",
                url,
                data: body,
                responseType: "blob",
            })
        },
        async update(
            body: TTUpdateBody,
            params: { id: string, },
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/time-track/:id"
            const url = createUrl(params, route)
            return await createAxiosInstance().request({
                method: "patch",
                url,
                data: body,
            })
        },
        async delete(
            params: { id: string, },
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/time-track/:id"
            const url = createUrl(params, route)
            return await createAxiosInstance().request({
                method: "delete",
                url,
            })
        },
        async batchCreate(
            body: TTBatchCreateBody,
            params: { userId: string, },
        ) : Promise<AxiosResponse<TTBatchCreateResBody[]>>
        {
            const route = "/time-track/batch/:userId"
            const url = createUrl(params, route)
            return await createAxiosInstance().request({
                method: "post",
                url,
                data: body,
            })
        },
    },
    resource: {
        async getAll(
            queries: { entityStatus: string, },
        ) : Promise<AxiosResponse<Resource[]>>
        {
            const route = "/resource"
            const url = route
            return await createAxiosInstance().request({
                method: "get",
                url,
                params: queries,
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
        async getClientsAndProjects(
            params: { id: string, },
        ) : Promise<AxiosResponse<GetClientsAndProjectsResBody>>
        {
            const route = "/resource/:id/clients-and-projects"
            const url = createUrl(params, route)
            return await createAxiosInstance().request({
                method: "get",
                url,
            })
        },
    },
    report: {
        async get(
            body: ReportReqBody,
        ) : Promise<AxiosResponse<Report[]>>
        {
            const route = "/report"
            const url = route
            return await createAxiosInstance().request({
                method: "post",
                url,
                data: body,
            })
        },
        async getTrackerHours(
            body: GetTrackerHoursReqBody,
        ) : Promise<AxiosResponse<number>>
        {
            const route = "/report/tracker-hours"
            const url = route
            return await createAxiosInstance().request({
                method: "post",
                url,
                data: body,
            })
        },
    },
    project: {
        async getAll(
            queries: { entityStatus: string, },
        ) : Promise<AxiosResponse<Project[]>>
        {
            const route = "/project"
            const url = route
            return await createAxiosInstance().request({
                method: "get",
                url,
                params: queries,
            })
        },
        async create(
            body: ProjectCreateBody,
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/project"
            const url = route
            return await createAxiosInstance().request({
                method: "post",
                url,
                data: body,
            })
        },
        async update(
            body: ProjectUpdateBody,
            params: { id: string, },
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/project/:id"
            const url = createUrl(params, route)
            return await createAxiosInstance().request({
                method: "patch",
                url,
                data: body,
            })
        },
    },
    client: {
        async getAll(
            queries: { entityStatus: string, },
        ) : Promise<AxiosResponse<Client[]>>
        {
            const route = "/client"
            const url = route
            return await createAxiosInstance().request({
                method: "get",
                url,
                params: queries,
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
        ) : Promise<AxiosResponse<string>>
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
        async updateAccess(
            body: ClientUpdateAccessBody,
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
            params: { userId: string,clientId: string, },
        ) : Promise<AxiosResponse<any>>
        {
            const route = "/client/:clientId/resource/:userId"
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
        async getUniquePartnerNames(
            queries: { isMe: string, },
        ) : Promise<AxiosResponse<string[]>>
        {
            const route = "/client/partner-names"
            const url = route
            return await createAxiosInstance().request({
                method: "get",
                url,
                params: queries,
            })
        },
    },
    
} 