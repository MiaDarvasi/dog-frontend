import { useSelector } from 'react-redux'
import paw from '../assets/imgs/icons/paw_orange.svg'
import payment from '../assets/imgs/icons/payment.svg'


export function IncomeCounter({ dogs }) {
    const count = useSelector(storeState => storeState.userModule.count)

    return (
        <section className='income-counter counter'>
            <section>
                <h1>סה״כ הכנסות<br /> חודשיות</h1>
                <p>0 ₪</p>
            </section>
            <img src={payment} />
        </section>
    )
}