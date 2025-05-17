import React, { useState } from 'react';
import { db } from './../../../server/commons/firebase';
import { collection, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';

function Mociones({ asambleaId, mocionId, userId }) {
  const [voto, setVoto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleEnviarVoto = async () => {
    if (!voto) {
      setMensaje('⚠️ Por favor selecciona una opción antes de enviar.');
      return;
    }

    try {
      // Buscar el documento del usuario en VOTOS
      const votosRef = collection(db, 'ASAMBLEA', asambleaId, 'MOCIONES', mocionId, 'Votos');
      const q = query(votosRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setMensaje('❌ No se encontró el documento del usuario en esta moción.');
        return;
      }

      const votoDoc = querySnapshot.docs[0];
      const votoDocRef = doc(db, 'ASAMBLEA', asambleaId, 'MOCIONES', mocionId, 'VOTOS', votoDoc.id);

      await updateDoc(votoDocRef, {
        voto,
        timestamp: new Date(),
      });

      setMensaje('✅ Voto registrado correctamente.');
    } catch (error) {
      console.error('❌ Error al guardar el voto:', error);
      setMensaje('❌ Error al guardar el voto.');
    }
  };

  return (
    <div>
      <h3>Moción</h3>

      <div>
        <label>
          <input
            type="radio"
            name="voto"
            value="A favor"
            checked={voto === "A favor"}
            onChange={(e) => setVoto(e.target.value)}
          />
          A favor
        </label>
        <label>
          <input
            type="radio"
            name="voto"
            value="En contra"
            checked={voto === "En contra"}
            onChange={(e) => setVoto(e.target.value)}
          />
          En contra
        </label>
        <label>
          <input
            type="radio"
            name="voto"
            value="Abstención"
            checked={voto === "Abstención"}
            onChange={(e) => setVoto(e.target.value)}
          />
          Abstención
        </label>
      </div>

      <button onClick={handleEnviarVoto}>Enviar voto</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Mociones;
