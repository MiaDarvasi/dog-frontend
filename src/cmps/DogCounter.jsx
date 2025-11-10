import { useEffect, useState } from 'react'
import paw from '../assets/imgs/icons/paw_orange.svg'
import bone from '../assets/imgs/icons/bone_orange.svg'
import { stayService } from '../services/stay.service'
import { showErrorMsg } from '../services/event-bus.service'

export function DogCounter() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        loadActiveCount()
    }, [])

    async function loadActiveCount() {
        try {
            const stays = await stayService.query()
            const now = new Date()

            // Count stays where today's date is between startDate and endDate (inclusive)
            const activeCount = stays.filter(stay => {
                const start = new Date(stay.startDate)
                const end = new Date(stay.endDate)
                return start <= now && end >= now
            }).length

            setCount(activeCount)
        } catch (err) {
            console.error('Error loading stays for counter:', err)
            showErrorMsg('שגיאה בספירת השוהים')
        }
    }

    return (
        <section className='dog-counter counter'>
            <section>
                <h1>סה״כ כלבים<br /> בפנסיון</h1>
                <p>{count}</p>
            </section>
            <img src={bone} alt="bone icon" />
        </section>
    )
}
