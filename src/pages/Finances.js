import React from "react";

function Finances({
  description,
  setDescription,
  amount,
  setAmount,
  addFinance,
  finances,
  totalFinance
}) {

  return (

    <div>

      <h2>
        Church Finances
      </h2>

      {/* FINANCE FORM */}

      <div className="member-form">

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
        />

        <button onClick={addFinance}>
          Add Finance
        </button>

      </div>

      {/* TOTAL */}

      <div className="card">

        <h3>
          Total Finances
        </h3>

        <p>
          N${totalFinance}
        </p>

      </div>

      {/* TABLE */}

      <table>

        <thead>

          <tr>

            <th>Description</th>
            <th>Amount</th>

          </tr>

        </thead>

        <tbody>

          {finances.map((item) => (

            <tr key={item.id}>

              <td>
                {item.description}
              </td>

              <td>
                N${item.amount}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default Finances;