import React from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200 h-14 flex  ">
        <div className=" w-full h-full flex justify-between items-center px-[50px] ">
          <div className="flex justify-center items-center gap-2">
            <Link href="/">
              <h1 className="text-xl font-semibold text-purple">Vio£ethat</h1>
            </Link>
          </div>
          <div className="flex justify-center items-center gap-6 ">
            <Bell className="w-5 h-5" />

            <div className="relative w-8 h-8">
              <Link href="#">
                <div className="relative w-8 h-8">
                  <Image
                    src="https://github.com/shadcn.png"
                    alt="Profile"
                    fill
                    className="rounded-full object-cover cursor-pointer"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
