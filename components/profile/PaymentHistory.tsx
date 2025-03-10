"use client";

const payments = [
  {
    id: "34451de2",
    date: "12/12/2005",
    mode: "Credit Card",
    amount: "324",
  },
  {
    id: "34451de2",
    date: "12/12/2005",
    mode: "Credit Card",
    amount: "324",
  },
  {
    id: "34451de2",
    date: "12/12/2005",
    mode: "Credit Card",
    amount: "324",
  },
  {
    id: "34451de2",
    date: "12/12/2005",
    mode: "Credit Card",
    amount: "324",
  },
  {
    id: "34451de2",
    date: "12/12/2005",
    mode: "Credit Card",
    amount: "324",
  },
];

const PaymentHistory = () => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="font-medium">Payment History</h3>
        <button className="text-sm text-purple hover:underline">
          View all submissions
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 sm:-mx-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden px-4 sm:px-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="py-3 text-left text-xs font-medium text-gray-500">
                    Payment ID
                  </th>
                  <th scope="col" className="py-3 text-left text-xs font-medium text-gray-500">
                    Date and Time
                  </th>
                  <th scope="col" className="py-3 text-left text-xs font-medium text-gray-500">
                    Mode of Payment
                  </th>
                  <th scope="col" className="py-3 text-left text-xs font-medium text-gray-500">
                    Amount
                  </th>
                  <th scope="col" className="py-3 text-right text-xs font-medium text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 text-sm text-gray-900">{payment.id}</td>
                    <td className="py-4 text-sm text-gray-900">{payment.date}</td>
                    <td className="py-4 text-sm text-gray-900">{payment.mode}</td>
                    <td className="py-4 text-sm text-gray-900">₹ {payment.amount}</td>
                    <td className="py-4 text-sm text-right">
                      <button className="text-purple hover:underline">
                        Download Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;