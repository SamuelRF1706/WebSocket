import { useEffect, useState } from 'react'
import './App.css'
import Asambleas from './components/asambleas'
import io from 'socket.io-client'
import Swal from 'sweetalert2'

import { getDocs, collection, addDoc } from 'firebase/firestore'
import { db } from './firebase.js'

const socket = io('http://localhost:5000')

function App() {
  const [mensaje, setMensaje] = useState({ name: '', message: '' })
  const [votoDocPath, setVotoDocPath] = useState(null) // Ruta para actualizar voto
  const [conteosEnVivo, setConteosEnVivo] = useState({}) // Conteos en tiempo real

  useEffect(() => {
    const identificarYGuardarUsuario = async () => {
      const result = await Swal.fire({
        icon: 'question',
        title: 'Identifícate',
        input: 'text',
        inputLabel: 'Escribe tu nombre',
        inputValue: '',
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputValidator: (value) => {
          if (!value) return 'Debes escribir un nombre'
        }
      })

      const nombre = result.value
      setMensaje(prev => ({ ...prev, name: nombre }))

      // Obtener ASAMBLEA y MOCIÓN
      const asambleasSnap = await getDocs(collection(db, 'ASAMBLEAS'))
      const asambleaDoc = asambleasSnap.docs[0]
      const asambleaId = asambleaDoc.id

      const mocionesSnap = await getDocs(collection(db, 'ASAMBLEAS', asambleaId, 'MOCIONES'))
      const mocionDoc = mocionesSnap.docs[0]
      const mocionId = mocionDoc.id

      // Crear VOTO con ID automático
      const votoRef = await addDoc(collection(db, 'ASAMBLEAS', asambleaId, 'VOTOS_PARTICIPANTES'), {
        nombre
      })

      // Guardar la ruta para luego actualizar el voto
      setVotoDocPath({
        asambleaId,
        mocionId,
        votoId: votoRef.id
      })
    }

    identificarYGuardarUsuario()
  }, [])

  // Escuchar conteos en tiempo real desde servidor via Socket.IO
  useEffect(() => {
    socket.on('conteo-actualizado', ({ asambleaId, conteo }) => {
      console.log('Conteo recibido del servidor:', asambleaId, conteo)
      setConteosEnVivo(conteo)
    })

    // Cleanup al desmontar el componente
    return () => {
      socket.off('conteo-actualizado')
    }
  }, [])

  return (
    <div className="container mt-5">
      <Asambleas 
        votoDocPath={votoDocPath} 
        nombreUsuario={mensaje.name} 
        conteosEnVivo={conteosEnVivo} 
      />
    </div>
  )
}

export default App
