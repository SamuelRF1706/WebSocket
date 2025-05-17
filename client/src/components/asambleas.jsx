import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../server/commons/firebase.js'  // Ajusta si tu archivo se llama diferente
import Mociones from '../components/mociones.jsx'

function Asambleas() {
    const [asamblea, setAsamblea] = useState(null)
    const [showMociones, setShowMociones] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ASAMBLEAS"))
            querySnapshot.forEach((doc) => {
                setAsamblea(doc.data()) // solo una, como dijiste
            })
        }

        fetchData()
    }, [])

    const handleClick = () => {
        setShowMociones(!showMociones)
    }

    if (showMociones) {
        return <Mociones />
    }

    return (
        <div className="card" style={{ width: '18rem' }}>
            <div className="card-body">
                <h5 className="card-title">{asamblea?.NOMBRE || 'Cargando...'}</h5>
                <h6 className="card-subtitle mb-2 text-body-secondary">{asamblea?.LUGAR || 'Cargando...'}</h6>
                <p className="card-text">{asamblea?.MOTIVO || 'Cargando...'}</p>
                <p className="card-text"><small>Fecha: {asamblea?.FECHA_SOLICITUD || 'Cargando...'}</small></p>
                <button type="button" className="btn btn-outline-dark" onClick={handleClick}>
                    Detalles
                </button>
            </div>
        </div>
    )
}

export default Asambleas
