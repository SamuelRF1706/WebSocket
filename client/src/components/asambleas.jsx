import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase.js'
import Mociones from '../components/mociones.jsx'
import AdminVotos from '../components/admin.jsx'  // Importa el componente admin que creamos antes

function Asambleas({ votoDocPath, nombreUsuario }) {
  const [asamblea, setAsamblea] = useState(null)
  const [asambleaId, setAsambleaId] = useState(null)
  const [showMociones, setShowMociones] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "ASAMBLEAS"))
      querySnapshot.forEach((doc) => {
        setAsamblea(doc.data()) // seguimos mostrando solo una
        setAsambleaId(doc.id)    // guardamos el id para usar en AdminVotos
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

  if (showAdmin && asambleaId) {
    return <AdminVotos asambleaId={asambleaId} />
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm border-0" style={{ width: '22rem' }}>
        <div className="card-body">
          <h3 className="card-title fw-bold text-primary mb-2">
            {asamblea?.NOMBRE || 'Cargando...'}
          </h3>
          <h6 className="card-subtitle text-muted mb-3 fst-italic">
            {asamblea?.LUGAR || 'Cargando...'}
          </h6>
          <p className="card-text text-dark lh-base mb-3">
            {asamblea?.MOTIVO || 'Cargando...'}
          </p>
          <p className="card-text text-secondary small">
            <strong>Fecha:</strong> {asamblea?.FECHA_SOLICITUD || 'Cargando...'}
          </p>
          <button
            type="button"
            className="btn btn-dark w-100 mt-3"
            onClick={handleClick}
          >
            Ver Mociones
          </button>
        </div>
        <button className="btn btn-outline-dark fw-semibold fst-italic" onClick={() => setShowAdmin(true)}>Ver resultados como administrador</button>
      </div>
    </div>
  )
}

export default Asambleas
