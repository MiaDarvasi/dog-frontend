import { Link } from 'react-router-dom'

import paw from '../assets/imgs/icons/paw_white_full.svg'
import male from '../assets/imgs/icons/male.svg'
import female from '../assets/imgs/icons/female.svg'
import warning from '../assets/imgs/icons/warning.svg'
import calendar from '../assets/imgs/icons/calendar.svg'
import phone from '../assets/imgs/icons/phone.svg'
import person from '../assets/imgs/icons/person.svg'
import edit from '../assets/imgs/icons/edit.svg'

export function DogPreview({ dog }) {

    return <article className="preview">

        <header>
            <div className='img-container'>
                <img src={paw} />
            </div>
            <section>
                <h1>{dog.name}</h1>
                <p>{dog.breed ? dog.breed : dog.gender === 'female' ? 'מעורבת' : 'מעורב'}</p>
            </section>
            <Link to={`/add/dog/${dog._id}`} className="edit-btn">
                <img src={edit} alt="edit" />
            </Link>
        </header>

        <section className='dog-details'>

            <section className='dog-gender details-ctg'>
                <img src={dog.gender === 'female' ? female : male} />
                <p>{dog.gender === 'female' ? 'נקבה' : 'זכר'}</p>
                {dog.castrated === 'no' &&
                    <div className='warning'>
                        <img src={warning} />
                        <p>{dog.gender === 'female' ? 'לא מעוקרת' : 'לא מסורס'}</p>
                    </div>
                }
            </section>

            <p className='details-ctg'>
                <img src={calendar} />
                {dog.gender === 'female' ? ' בת' : ' בן'}&nbsp;
                {dog.age.toLocaleString() === '1' ? 'שנה' : `${dog.age.toLocaleString()} שנים`}
            </p>

            <p className='details-ctg'><img src={person} />{dog.ownerName}</p>
            <p className='details-ctg'>
                <img src={phone} />
                <a href={`tel:${dog.ownerPhone}`}>{dog.ownerPhone}</a>
            </p>

        </section>


    </article>
}
