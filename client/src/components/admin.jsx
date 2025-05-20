import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../server/commons/firebase.js'

function AdminVotos({ asambleaId }) {
  const [mociones, setMociones] = useState([])
  const [conteos, setConteos] = useState({})

  useEffect(() => {
    if (!asambleaId) return

    const fetchData = async () => {
      try {
        const mocionesSnap = await getDocs(collection(db, 'ASAMBLEAS', asambleaId, 'MOCIONES'))
        const mocionesList = mocionesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setMociones(mocionesList)

        const votosSnap = await getDocs(collection(db, 'ASAMBLEAS', asambleaId, 'VOTOS_PARTICIPANTES'))
        const votosList = votosSnap.docs.map(doc => doc.data())

        const conteoTemp = {}

        mocionesList.forEach((mocion, idx) => {
          const campo = `RM${idx + 1}`
          conteoTemp[campo] = {}
          votosList.forEach(votoDoc => {
            const voto = votoDoc[campo]
            if (voto) {
              conteoTemp[campo][voto] = (conteoTemp[campo][voto] || 0) + 1
            }
          })
        })

        setConteos(conteoTemp)
      } catch (error) {
        console.error('Error cargando datos para administrador:', error)
      }
    }

    fetchData()
  }, [asambleaId])

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">📊 Resumen de votos por moción</h2>

      {mociones.length === 0 && (
        <div className="alert alert-info" role="alert">
          Cargando mociones...
        </div>
      )}

      {mociones.map((mocion, idx) => {
        const campo = `RM${idx + 1}`
        const votosPorOpcion = conteos[campo] || {}

        const titulo =
          mocion.MocionSuspencion ||
          mocion.MocionAprobacion ||
          mocion.MocionConfianza ||
          'Sin título'

        return (
          <div key={mocion.id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">🗳️ Moción #{mocion.id}</h5>
              <p className="card-text"><strong>Texto:</strong> {titulo}</p>

              <div className="table-responsive">
                <table className="table table-bordered table-striped mt-3">
                  <thead className="table-dark">
                    <tr>
                      <th>Opción</th>
                      <th>Cantidad de votos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(votosPorOpcion).map(([opcion, cantidad]) => (
                      <tr key={opcion}>
                        <td>{opcion}</td>
                        <td>{cantidad}</td>
                      </tr>
                    ))}
                    {Object.keys(votosPorOpcion).length === 0 && (
                      <tr>
                        <td colSpan="2" className="text-center text-muted">
                          No hay votos registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AdminVotos
