import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Context from "../../Context/Context";
import { getMultipleDocs } from "../../firebase/firebaseMethods";
import { useQueries, useQuery } from "@tanstack/react-query";
const UserOrders = () => {
  const { User } = useContext(Context);
  // const [OrderStatuses, setOrderStatuses] = React.useState();
  const [Keyword, setKeyword] = React.useState(""); // * Take-Care Of Filteration (Searching by order-id)
  // const [Filter, setFilter] = React.useState(""); // * Take-Care Of Filteration (Ascending/Descending)
  const [FilterByDate, setFilterByDate] = React.useState("desc");
  const [FilterByPrice, setFilterByPrice] = React.useState("");

  const [Orders, setOrders] = React.useState([]);
  const nav = useNavigate();

  const OrderStatuses = {
    Received: "bg-green-100",
    Pending: "bg-yellow-100",
    Failed: "bg-red-100",
  };
  const navigateToOrderDetails = (order) => {
    nav(`/orders/${order.id}`, {
      state: {
        ...{ order },
      },
    });
  };

  React.useEffect(() => {
    // setOrderStatuses({
    //   Received: "bg-green-100",
    //   Pending: "bg-yellow-100",
    //   Failed: "bg-red-100",

    // });

    (async () => {
      const userOrders = await getMultipleDocs("orders");
      setOrders(
        userOrders.filter(
          (order) => String(order?.email) === String(User?.email)
        )
      );
    })();
  }, []);

  Orders.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    // * Empty String Of {{Filter}}-State Means "descending-order" & By Default It's Descending
    if (FilterByDate === "asc") {
      // * Ascending Order
      return new Date(a.timestamp) - new Date(b.timestamp);
    } else if (FilterByPrice === "asc") {
      return new Date(a.netAmount) - new Date(b.netAmount);
    } else if (FilterByPrice === "desc") {
      return new Date(b.netAmount) - new Date(a.netAmount);
    } else if (FilterByDate === "desc") {
      // * Descending Order
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
  });
  React.useEffect(() => {
    scrollTo(0, 0);
  }, []);
  return (
    <section class=" overflow-x-auto pt-[10rem] min-h-screen">
      <div className="mx-auto max-w-[80rem] p-2 ">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl pl-[1rem] max-w-[80rem]">All Orders:-</h1>
          <input
            value={Keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-[14rem] px-2 mr-5 py-1 outline-none border-gray-300 rounded-sm border-[1px] focus:border-gray-400 transition-all"
            placeholder="Search By Order ID"
            type={"text"}
          />
        </div>
        <table class="min-w-[100%] divide-y-2 divide-gray-200 text-sm ml-[1rem]">
          <thead>
            <tr>
              <th class="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 ">
                Order Id
              </th>
              <th class="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 ">
                Email
              </th>
              <th
                onClick={() => {
                  setFilterByPrice("");
                  setFilterByDate(() =>
                    FilterByDate === "asc" ? "desc" : "asc"
                  );
                }}
                class="cursor-pointer whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 flex items-center gap-1"
              >
                <span>Order Date</span>

                <svg
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </th>
              <th class="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                Order Status
              </th>
              <th
                onClick={() => {
                  setFilterByDate("");
                  setFilterByPrice(() =>
                    FilterByPrice === "asc" ? "desc" : "asc"
                  );
                }}
                class=" flex gap-1 cursor-pointer whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
              >
                <span>Net Amount</span>

                <svg
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </th>
              <th class="px-4 py-2"></th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">
            {Orders.filter((order) =>
              order.id.toLowerCase().includes(Keyword.toLowerCase())
            ).map((order) => {
              return (
                <tr className="hover:bg-gray-200 transition-all">
                  <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    #{order["id"]}
                  </td>
                  <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {order["email"]}
                  </td>
                  <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                    {new Date(Date(order["timestamp"])).toLocaleDateString()}
                  </td>
                  <td class="whitespace-nowrap px-4 py-2 text-gray-700 ">
                    <span
                      className={`${OrderStatuses?.[status]} px-2 py-1 rounded-md`}
                    >
                      {order["status"].at(-1)}
                    </span>
                  </td>

                  <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                    Rs:{order["netAmount"].toLocaleString("en-US")}
                  </td>
                  <td class="whitespace-nowrap px-4 py-2">
                    <button
                      // to={{pathname:`/orders/${order.id}`}}
                      onClick={() => navigateToOrderDetails(order)}
                      className="inline-block rounded bg-yellow-600 px-4 py-2 text-xs font-medium text-white hover:bg-yellow-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserOrders;