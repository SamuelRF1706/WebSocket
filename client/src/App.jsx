import { useEffect, useState } from 'react'
import './App.css'
import Asambleas from './components/asambleas'
import io from 'socket.io-client'
import Swal from 'sweetalert2'

import { getDocs, collection, addDoc } from 'firebase/firestore'
import { db } from '../../server/commons/firebase'

const socket = io('http://localhost:5000')

function App() {
  const [mensaje, setMensaje] = useState({ name: '', message: '' });
  const [votoDocPath, setVotoDocPath] = useState(null);

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
          if (!value) return 'Debes escribir un nombre';
        }
      });

      const nombre = result.value;
      setMensaje(prev => ({ ...prev, name: nombre }));

      // Obtener ASAMBLEA y MOCIÓN
      const asambleasSnap = await getDocs(collection(db, 'ASAMBLEAS'));
      const asambleaDoc = asambleasSnap.docs[0];
      const asambleaId = asambleaDoc.id;

      const mocionesSnap = await getDocs(collection(db, 'ASAMBLEAS', asambleaId, 'MOCIONES'));
      const mocionDoc = mocionesSnap.docs[0];
      const mocionId = mocionDoc.id;

      // Crear VOTO
      const votoRef = await addDoc(
        collection(db, 'ASAMBLEAS', asambleaId, 'MOCIONES', mocionId, 'VOTOS'),
        { nombre }
      );

      // Guardar ruta
      setVotoDocPath({
        asambleaId,
        mocionId,
        votoId: votoRef.id
      });
    };

    identificarYGuardarUsuario();

    // socket.on('chat:client', (data) => {
    //   console.log(data);
    // });

    // socket.on('cantidadVeces', (data) => {
    //   console.log('Veces conectado:', data);
    // });

  }, []);

  return (
    <div className="container mt-5">
      {/* Pasamos votoDocPath y mensaje.name a Asambleas */}
      {votoDocPath && mensaje.name && (
        <Asambleas votoId={votoDocPath.votoId} mocionPath={votoDocPath} />
      )}
    </div>
  );
}

export default App;
