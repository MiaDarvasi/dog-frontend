import { httpService } from './http.service'


export const stayService = {
    addStay,
    query,
    remove
}


async function addStay(stayData) {
    return httpService.post('stay', stayData)
}


async function query(filterBy = {}) {
    return httpService.get('stay', filterBy)
}

async function remove(stayId) {
    return httpService.delete(`stay/${stayId}`)
}
