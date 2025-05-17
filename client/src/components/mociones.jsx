import React, { useState } from 'react';
import { addDoc, collection, doc } from 'firebase/firestore'; // Funciones del SDK Firestore
import { db } from './../../../server/commons/firebase';    // Solo importas `db` desde tu archivo local


function Mociones({ asambleaId, mocionId, userId }) {
    const [voto, setVoto] = useState('');
    const [mensaje, setMensaje] = useState('');

        const handleEnviarVoto = async () => {
        if (!voto) {
            setMensaje('⚠️ Por favor selecciona una opción antes de enviar.');
            return;
        }

        const votoData = {
            voto,
            userId: userId || 'anonimo',
            timestamp: new Date()
        };

        try {
            const votosRef = collection(
                doc(
                    collection(
                        doc(db, 'ASAMBLEA', asambleaId),
                        'MOCIONES'
                    ),
                    mocionId
                ),
                'VOTOS'
            );

            await addDoc(votosRef, votoData);
            setMensaje('✅ Voto registrado correctamente.');
        } catch (error) {
            console.error('❌ Error al guardar el voto:', error);
            setMensaje('❌ Error al guardar el voto.');
        }
    };

    return (
        <div className="card p-3 mt-3">
            <h4>Moción: {mocionId}</h4>
            <div className="form-check">
                <input
                    type="radio"
                    className="form-check-input"
                    name="radioDefault"
                    value="A favor"
                    onChange={(e) => setVoto(e.target.value)}
                    checked={voto === 'A favor'}
                    id="aFavor"
                />
                <label htmlFor="aFavor" className="form-check-label">A favor</label>
            </div>
            <div className="form-check">
                <input
                    type="radio"
                    className="form-check-input"
                    name="voto"
                    value="En contra"
                    onChange={(e) => setVoto(e.target.value)}
                    checked={voto === 'En contra'}
                    id="enContra"
                />
                <label htmlFor="enContra" className="form-check-label">En contra</label>
            </div>
            <div className="form-check">
                <input
                    type="radio"
                    className="form-check-input"
                    name="voto"
                    value="No votar"
                    onChange={(e) => setVoto(e.target.value)}
                    checked={voto === 'No votar'}
                    id="noVotar"
                />
                <label htmlFor="noVotar" className="form-check-label">No votar</label>
            </div>

            <button className="btn btn-dark mt-3" onClick={handleEnviarVoto}>
                Enviar voto
            </button>

            {mensaje && <p className="mt-2">{mensaje}</p>}
        </div>
    );
}

export default Mociones;
