import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../server/commons/firebase.js'

function AdminVotos({ asambleaId }) {
  const [mociones, setMociones] = useState([])
  const [conteos, setConteos] = useState({}) // { RM1: { opcion1: 3, opcion2: 5 }, RM2: {...} }

  useEffect(() => {
    if (!asambleaId) return

    const fetchData = async () => {
      try {
        // 1. Traer mociones para tener IDs y poder asignar RM1, RM2...
        const mocionesSnap = await getDocs(collection(db, 'ASAMBLEAS', asambleaId, 'MOCIONES'))
        const mocionesList = mocionesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setMociones(mocionesList)

        // 2. Traer todos los votos de VOTOS_PARTICIPANTES
        const votosSnap = await getDocs(collection(db, 'ASAMBLEAS', asambleaId, 'VOTOS_PARTICIPANTES'))
        const votosList = votosSnap.docs.map(doc => doc.data())

        // 3. Contar votos para cada RM
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
      <h2>Resumen de votos por moción</h2>

      {mociones.length === 0 && <p>Cargando mociones...</p>}

      {mociones.map((mocion, idx) => {
        const campo = `RM${idx + 1}`
        const votosPorOpcion = conteos[campo] || {}

        return (
          <div key={mocion.id} style={{ marginBottom: '2rem' }}>
            <h4>Moción #{idx + 1}</h4>
            <p><strong>Título:</strong> {mocion.MocionAprobacion || mocion.MocionConfianza || mocion.MocionSuspencion || 'Sin título'}</p>

            <table border="1" cellPadding="5">
              <thead>
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
                    <td colSpan="2">No hay votos registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}

export default AdminVotos
