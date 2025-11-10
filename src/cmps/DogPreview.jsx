
import { useState } from 'react'
import { Link } from 'react-router-dom'

import info from '../assets/imgs/icons/info.svg'
import paw from '../assets/imgs/icons/paw_white_full.svg'
import dogimg from '../assets/imgs/icons/dog.svg'
import num from '../assets/imgs/icons/num.svg'
import male from '../assets/imgs/icons/male.svg'
import female from '../assets/imgs/icons/female.svg'
import warning from '../assets/imgs/icons/warning.svg'
import calendar from '../assets/imgs/icons/calendar.svg'
import phone from '../assets/imgs/icons/phone.svg'
import person from '../assets/imgs/icons/person.svg'
import edit from '../assets/imgs/icons/edit.svg'
import price from '../assets/imgs/icons/price.svg'
import add from '../assets/imgs/icons/add-white.svg'
import city from '../assets/imgs/icons/city.svg'
import grass from '../assets/imgs/icons/grass.svg'
import calendar2 from '../assets/imgs/icons/calendar-white.svg'

export function DogPreview({ dog }) {

    const [showModal, setShowModal] = useState(false)
    const isStaying =
        dog.stay &&
        new Date(dog.stay.startDate) <= now &&
        new Date(dog.stay.endDate) >= now

    function openModal() {
        setShowModal(true)
    }

    function closeModal() {
        setShowModal(false)
    }

    return (
        <>
            <article className={`dog-preview ${isStaying ? 'staying' : ''}`}>

                <header
                    style={dog.imgUrl ? {
                        backgroundImage: `url(${dog.imgUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    } : {}}
                >

                    <button className="details-btn" onClick={openModal}> <img src={info} /></button>

                    <div className='img-container'>
                        <img src={paw} />
                    </div>

                    <section className='dog-header-info'>
                        <h1>{dog.name}</h1>
                        <p>{dog.breed ? dog.breed : dog.gender === 'female' ? 'מעורבת' : 'מעורב'}</p>
                    </section>

                    <section className='header-actions'>
                        <Link to={`/add/dog/${dog._id}`} className="edit-btn">
                            <img src={edit} alt="edit" />
                        </Link>
                        <Link to={`/stay/add/${dog._id}`} className="add-stay-btn">
                            <img src={add} />
                            <img src={calendar2} />
                        </Link>
                    </section>


                </header>


                <section className='dog-details'>

                    {dog.castrated === 'no' &&
                        <div className='warning'>
                            <img src={warning} />
                            <p>{dog.gender === 'female' ? 'לא מעוקרת' : 'לא מסורס'}</p>
                        </div>
                    }
                    <section className='dog-gender details-ctg'>
                        <img src={dog.gender === 'female' ? female : male} />
                        <p>{dog.gender === 'female' ? 'נקבה' : 'זכר'}</p>
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

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="info-modal" onClick={e => e.stopPropagation()}>
                        <section>
                            <img className='main-dog-img' src={dogimg} />
                            <article>
                                <p><strong>שם:</strong> {dog.name}</p>
                                <p><strong>גזע:</strong> {dog.breed}</p>
                            </article>
                        </section>
                        <p><img src={dog.gender === 'female' ? female : male} /><strong>מין:</strong> {dog.gender === 'female' ? 'נקבה' : 'זכר'}</p>
                        <p><img src={calendar} /><strong>גיל:</strong> {dog.age}</p>
                        <p><img src={grass} /><strong>חצר:</strong> {dog.size === 'big' ? 'גדולים' : dog.size === 'small' ? 'קטנים' : '-'}</p>
                        <p><img src={num} /><strong>מספר צ׳יפ:</strong> {dog.chip}</p>
                        <p><img src={person} /><strong>שם בעלים:</strong> {dog.ownerName}</p>
                        <p>
                            <img src={phone} />
                            <strong>טלפון בעלים:</strong>{' '}
                            <a href={`tel:${dog.ownerPhone}`}>{dog.ownerPhone}</a>
                        </p>
                        <p><img src={city} /><strong> עיר:</strong> {dog.city || 'לא צוין'}</p>
                        <p><img src={price} /><strong>מחיר ליום:</strong> {dog.pricePerDay}</p>
                        <p><img src={price} /><strong>מחיר תספורת:</strong> {dog.haircutPrice}</p>
                        <hr />
                        <p><strong>ציוד שהביא:</strong> {dog.equipment}</p>
                        <p><strong>מיקום ציוד:</strong> {dog.equipmentLoc}</p>
                        <p><strong>תרופות:</strong> {dog.med}</p>
                        <p><strong>אוכל מיוחד:</strong> {dog.specialFood}</p>
                        <p><strong>צבע קולר:</strong> {dog.collarColor}</p>
                        <p><strong>מספר פנסיון:</strong> {dog.ourNum}</p>
                        <p><strong>הערות:</strong> {dog.notes}</p>
                        {/* <button onClick={closeModal}>סגור</button> */}
                    </div>
                </div>
            )}
        </>
    )
}
