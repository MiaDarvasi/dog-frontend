import React from 'react'
import { Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage'
import { DogIndex } from './pages/DogIndex.jsx'
import { DogDetails } from './pages/DogDetails'
import { UserMsg } from './cmps/UserMsg.jsx'
import { AddDog } from './pages/AddDog.jsx'
import { AddStay } from './pages/AddStay.jsx'
import { FeedingChecklist } from './pages/FeedingChecklist.jsx'

export function RootCmp() {
    return (
        <div className="main-container">
            {/* <AppHeader /> */}
            <UserMsg />

            <main>
                <Routes>
                    <Route path="" element={<HomePage />} />
                    <Route path="dog" element={<DogIndex />} />
                    <Route path="add/dog" element={<AddDog />} />
                    <Route path="add/dog/:dogId" element={<AddDog />} />
                    <Route path="dog/:dogId" element={<DogDetails />} />
                    <Route path="stay/add/:dogId" element={<AddStay />} />
                    <Route path="/feeding-checklist" element={<FeedingChecklist />} />
                </Routes>
            </main>
        </div>
    )
}


