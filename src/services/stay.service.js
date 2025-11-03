import { httpService } from './http.service'


export const stayService = {
    addStay,
    query
}


async function addStay(stayData) {
    return httpService.post('stay', stayData)
}


async function query(filterBy = {}) {
    return httpService.get('stay', filterBy)
}