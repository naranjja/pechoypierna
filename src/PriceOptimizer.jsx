import { useState } from "react";

export const calcBestCombo = (pechos, piernas, costs) => {
  let best = null;

  const maxEnteros = Math.ceil(Math.max(pechos, piernas) / 2);
  const maxMedios = Math.max(pechos, piernas);

  for (let w = 0; w <= maxEnteros; w++) {
    for (let h = 0; h <= maxMedios; h++) {
      const remainingPechos = pechos - (2 * w + h);
      const remainingPiernas = piernas - (2 * w + h);
      if (remainingPechos < 0 || remainingPiernas < 0) continue;

      const qp = remainingPechos;
      const ql = remainingPiernas;

      const cost =
        w * costs.entero +
        h * costs.medio +
        qp * costs.cuartoPecho +
        ql * costs.cuartoPierna;

      const combo = {
        enteros: w,
        medios: h,
        cuartosPecho: qp,
        cuartosPierna: ql,
        cost,
      };

      if (!best || cost < best.cost) {
        best = combo;
      } else if (cost === best.cost) {
        const bestTuple = [
          best.cuartosPecho + best.cuartosPierna,
          best.medios,
          best.enteros,
        ];
        const thisTuple = [qp + ql, h, w];
        if (
          thisTuple[0] < bestTuple[0] ||
          (thisTuple[0] === bestTuple[0] &&
            (thisTuple[1] < bestTuple[1] ||
              (thisTuple[1] === bestTuple[1] && thisTuple[2] < bestTuple[2])))
        ) {
          best = combo;
        }
      }
    }
  }
  return best;
};

export default function PriceOptimizer() {
  const [pechos, setPechos] = useState("4");
  const [piernas, setPiernas] = useState("1");
  const [costs, setCosts] = useState(
    /** @type {Costs} */ {
      entero: 55,
      medio: 30,
      cuartoPecho: 18,
      cuartoPierna: 15,
    }
  );
  const [result, setResult] = useState(null);

  const handleOptimize = () => {
    const combo = calcBestCombo(
      parseInt(pechos, 10) || 0,
      parseInt(piernas, 10) || 0,
      costs
    );
    setResult(combo);
  };

  return (
    <div className="wrapper">
      <table className="input-table">
        <thead>
          <tr>
            <th></th>
            <th>Cantidad</th>
            <th>Precio (S/)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Pechos</td>
            <td>
              <input
                type="number"
                value={pechos}
                onChange={(e) => setPechos(e.target.value)}
                min="0"
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>Piernas</td>
            <td>
              <input
                type="number"
                value={piernas}
                onChange={(e) => setPiernas(e.target.value)}
                min="0"
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>Entero</td>
            <td></td>
            <td>
              <input
                type="number"
                value={costs.entero}
                min="0"
                onChange={(e) => setCosts({ ...costs, entero: parseFloat(e.target.value || "0") })}
              />
            </td>
          </tr>
          <tr>
            <td>Medio</td>
            <td></td>
            <td>
              <input
                type="number"
                value={costs.medio}
                min="0"
                onChange={(e) => setCosts({ ...costs, medio: parseFloat(e.target.value || "0") })}
              />
            </td>
          </tr>
          <tr>
            <td>¼ Pecho</td>
            <td></td>
            <td>
              <input
                type="number"
                value={costs.cuartoPecho}
                min="0"
                onChange={(e) => setCosts({ ...costs, cuartoPecho: parseFloat(e.target.value || "0") })}
              />
            </td>
          </tr>
          <tr>
            <td>¼ Pierna</td>
            <td></td>
            <td>
              <input
                type="number"
                value={costs.cuartoPierna}
                min="0"
                onChange={(e) => setCosts({ ...costs, cuartoPierna: parseFloat(e.target.value || "0") })}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleOptimize}>Calcular</button>
      {result && (
        <div className="result">
          <h3>Mejor combinación</h3>
          <p>Enteros: {result.enteros}</p>
          <p>Medios: {result.medios}</p>
          <p>¼ Pecho: {result.cuartosPecho}</p>
          <p>¼ Pierna: {result.cuartosPierna}</p>
          <p>
            <strong>Costo total: S/ {result.cost.toFixed(2)}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

import "./PriceOptimizer.css";
