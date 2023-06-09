import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { showToast } from "../constants/toastNotification";
import { getMultipleDocs } from "../firebase/firebaseMethods";
import Context from "../Context/Context";

const Dropdown2 = ({
  dropdownName,
  list,
  logo,
  forAccount,
  SignOutHandler,
}) => {
  const { setProfileData, User } = useContext(Context);
  const [IsOpenedDropdown, setIsOpenedDropdown] = useState(false);
  useEffect(() => {
    (async () => {
      const docs = await getMultipleDocs("users");
      for (let doc of docs) {
        if (doc.uid === User.uid) {
          setProfileData({
            name: doc.name,
            email: doc.email,
            location: doc.location,
            role: doc.admin,
          });
          console.log(doc);
        }
      }
    })();
  }, []);

  return (
    <div class="  inline-block relative">
      <button
        class="  hover:text-gray-800 text-gray-500 font-normal rounded inline-flex items-center transition-all"
        onClick={() => setIsOpenedDropdown(!IsOpenedDropdown)}
      >
        <span class="mr-1">{dropdownName ? dropdownName : ""}</span>
        {logo}
      </button>
      <ul
        class={`dropdown-menu rounded-md shadow-sm absolute ${
          IsOpenedDropdown ? "block" : "hidden"
        } ${forAccount ? "-left-20 " : ""}  text-gray-700 pt-1 bg-white`}
      >
        {list &&
          list.map(({ url, name }) => (
            <li
              onClick={() => {
                if (name === "Logout") {
                  SignOutHandler();
                  showToast("success", "Successfully Signout");
                }
                setIsOpenedDropdown(false);
              }}
            >
              <Link
                class="rounded-sm transition-all rounded-t text-gray-700 hover:text-yellow-500 w-[7.2rem] py-2 px-3.5 block whitespace-no-wrap"
                to={url}
              >
                {name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Dropdown2;
