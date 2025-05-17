import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../server/commons/firebase.js'
import Mociones from '../components/mociones.jsx'

function Asambleas({ votoDocPath, nombreUsuario }) {
  const [asamblea, setAsamblea] = useState(null)
  const [showMociones, setShowMociones] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "ASAMBLEAS"))
      querySnapshot.forEach((doc) => {
        setAsamblea(doc.data()) // seguimos mostrando solo una
      })
    }

    fetchData()
  }, [])

  const handleClick = () => {
    setShowMociones(true)
  }

  if (showMociones && votoDocPath) {
    return <Mociones votoId={votoDocPath.votoId} mocionPath={votoDocPath} />
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
