import { useEffect, useState } from "react"
import bone from '../assets/imgs/icons/bone_orange.svg'
import dogimg from '../assets/imgs/icons/dog_orange.svg'
import { stayService } from "../services/stay.service"
import { dogService } from "../services/dog"

export function YardCounter() {
    const [counts, setCounts] = useState({ small: 0, big: 0 })

    useEffect(() => {
        loadCounts()
    }, [])

    async function loadCounts() {
        try {
            const allStays = await stayService.query()
            const now = new Date()
            // Active stays only
            const activeStays = allStays.filter(stay =>
                new Date(stay.startDate) <= now && new Date(stay.endDate) >= now
            )

            const dogs = await Promise.all(
                activeStays.map(stay => dogService.getById(stay.dogId))
            )

            const smallCount = dogs.filter(dog => dog.size === 'small').length
            const bigCount = dogs.filter(dog => dog.size === 'big').length

            setCounts({ small: smallCount, big: bigCount })
        } catch (err) {
            console.error('Error loading yard counts:', err)
        }
    }

    return (
        <section className='yard-counter counter'>
            <section>
                <article>
                    <p>{counts.big}</p>
                    <h1>גדולים</h1>
                </article>
                <article>
                    <p>{counts.small}</p>
                    <h1>קטנים</h1>
                </article>
            </section>
            <img src={dogimg} alt="bone icon" />
        </section>
    )
}
