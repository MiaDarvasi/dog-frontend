const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

import { dogService as local } from './dog.service.local'
import { dogService as remote } from './dog.service.remote'

function getEmptyDog() {
    return {
        name: "",
        gender: "",
        breed: "",
        age: 0,
        ownerName: "",
        ownerPhone: "",
        castrated: "",
        // imgUrl: ""
    }
}

function getDefaultFilter() {
    return {
        name: '',
        // age: '',
        // sortField: '',
        // sortDir: '',
    }
}

const service = VITE_LOCAL === 'true' ? local : remote
export const dogService = { getEmptyDog, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.dogService = dogService
