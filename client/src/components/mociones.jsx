function Mociones() {
    return (
        <div className="container">
            <h3 className="text-center">Mociones</h3>
            <div className="form-check">
                <h4>¿A favor o en contra?</h4>
                <input className="form-check-input" type="radio" name="radioDefault" id="radioDefault1" />
                <label className="form-check-label" htmlFor="radioDefault1">
                    A favor
                </label>
            </div>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="radioDefault"
                    id="radioDefault2"
                />
                <label className="form-check-label" htmlFor="radioDefault2">
                    En contra
                </label>
            </div>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="radioDefault"
                    id="radioDefault2"
                    defaultChecked
                />
                <label className="form-check-label" htmlFor="radioDefault2">
                    No votar
                </label>
            </div>
        </div>
    );
}

export default Mociones;