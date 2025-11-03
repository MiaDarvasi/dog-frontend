const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

import { dogService as local } from './dog.service.local'
import { dogService as remote } from './dog.service.remote'

function getEmptyDog() {
    return {
        name: "",
        gender: "",
        chip: "",
        breed: "",
        age: 0,
        ownerName: "",
        ownerPhone: "",
        castrated: "",
        pricePerDay: 200,
        // imgUrl: ""
    }
}

function getDefaultFilter() {
    return {
        txt: '',
    }
}

const service = VITE_LOCAL === 'true' ? local : remote
export const dogService = { getEmptyDog, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.dogService = dogService
