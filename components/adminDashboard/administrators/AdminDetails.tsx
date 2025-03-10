"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCcw, ShieldPlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import Image from "next/image";
// import { getAdminById, updateAdmin } from "@/API/admin";
import ReImageKit from "@/components/imageKit/ReImageKit";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { fetchUserById, modifyUser } from "@/redux/features/userSlice";
import { useRouter } from "next/navigation";

const roles = [
  "System Administrator",
  "Security Manager",
  "Content Manager",
  "User Manager",
  "Report Analyst",
];

const adminRightOptions = [
  "User Management",
  "Security Settings",
  "System Configuration",
  "Content Management",
  "Report Generation",
];
const AdminDetails = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();
  const { userById: user } = useAppSelector((state: RootState) => state.user);

  const [adminName, setAdminName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  // const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(true);
  const router = useRouter()


  // Role
  // const [role, setRole] = useState<string>("");
  const [assignedRole, setAssignedRole] = useState<string>("");


  // Admin Rights (multiple checkboxes)
  const [selectedRights, setSelectedRights] = useState<string[]>([]);

  const [image, setImage] = useState("https://github.com/shadcn.png");


  useEffect(() => {
    if (user) {

      setAdminName(user?.name ?? "");
      setMobile(user?.mobileNo ?? "");
      setEmail(user?.email ?? "");
      setAddress(user?.address?.addressLine ?? "");
      setCity(user?.address?.city ?? "");
      setStateName(user?.address?.state ?? "");
      setCountry(user?.address?.country ?? "");
      setPincode(user?.address?.pincode ?? "");
      setAssignedRole(user?.assignedRole ?? "");
      setSelectedRights(user?.adminRights ?? []);
      setImage(user?.avatar ?? "https://github.com/shadcn.png");
      setLoaded(false)
    }
  }, [user]);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [id, dispatch]);


  // useEffect(() => {
  //   const getSingleAdmin = async () => {
  //     try {
  //       const res = await getAdminById(adminId);
  //       if (res) {
  //         setAdminName(res?.name || "");
  //         setMobile(res.mobileNo || "");
  //         setEmail(res.email || "");
  //         setAddress(res.address?.addressLine || "");
  //         setCity(res.address?.city || "");
  //         setStateName(res.address?.state || "");
  //         setCountry(res.address?.country || "");
  //         setPincode(res.address?.pincode || "");
  //         setRole(res.role || "");
  //         setSelectedRights(res.adminRights || []);
  //         setImage(res.avatar || "https://github.com/shadcn.png");
  //       }
  //       // console.log({ res});
  //     } catch (error) {
  //       console.error("Failed to fetch admin details", error);
  //     }
  //   };
  //   getSingleAdmin();
  // }, [adminId]);

  const handleRightChange = (option: string) => {
    setSelectedRights((prev) => {
      if (prev.includes(option)) {
        return prev.filter((right) => right !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleSubmit = async () => {
    if (!user) return;
    const formData = {
      name: adminName,
      mobileNo: mobile,
      email,
      address: {
        addressLine: address,
        city,
        state: stateName,
        country,
        pincode,
      },
      assignedRole,
      adminRights: selectedRights,
      avatar: image,
    };

    try {
      const result = await dispatch(modifyUser({ userId: user._id, userData: formData }));
      if (modifyUser.fulfilled.match(result)) {
        console.log("User updated successfully!"); 
        router.back();
      } else {
        throw result.payload;
      }
    } catch (error) {
      console.error("Failed to update admin:", error);
      toast.error((error as string) ?? "Failed to update admin details.");
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm ">
      <div className="space-y-6">
        <div className="flex items-start gap-6">
          <div className=" p-3 flex justify-center items-center flex-col ">
            <Image
              src={image}
              alt="Profile"
              className="w-28 h-28 rounded-3xl object-cover  "
              width={112}
              height={112}
            />
            <div className="flex gap-2 mt-3">
              <ReImageKit
                id="profilePic"
                initialUrl={image}
                onSuccess={(res) => {
                  const imgUrl = res.url;
                  setImage(imgUrl);
                }}
                btnClassName="border border-[#c858ba] bg-[#7421931A] text-sm   text-[#742193] p-1 rounded-lg"
                btnIcon={<RefreshCcw />}
                btnText=""
                isAlwaysBtn
                isImgPreview={false}
              />
              <Button
                variant="secondary"
                size="icon"
                className="border border-[#c858ba] bg-[#7421931A] text-sm  text-[#742193] p-1 rounded-lg"
                onClick={() => setImage("")}
              >
                <Trash2 />
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-[#2E2E2E] font-bold">
                Administrator Name
              </Label>
              <Input
                id="fullName"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="mt-1 text-[#2E2E2E]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobile" className="text-[#2E2E2E] font-bold">
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="mt-1 text-[#2E2E2E]"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-[#2E2E2E] font-bold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 text-[#2E2E2E]"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="address" className="text-[#2E2E2E] font-bold">
            Address Line{" "}
          </Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 text-[#2E2E2E]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city" className="text-[#2E2E2E] font-bold">
              City
            </Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 text-[#2E2E2E]"
            />
          </div>
          <div>
            <Label htmlFor="state" className="text-[#2E2E2E] font-bold">
              State
            </Label>
            <Input
              id="state"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="mt-1 text-[#2E2E2E]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country" className="text-[#2E2E2E] font-bold">
              Country
            </Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 text-[#2E2E2E]"
            />
          </div>
          <div>
            <Label htmlFor="pincode" className="text-[#2E2E2E] font-bold">
              Pincode
            </Label>
            <Input
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="mt-1 text-[#3b3b3b]"
            />
          </div>
        </div>

        {/* Role Selection */}
        <div className="">
          <label className="text-sm font-bold text-gray-700 mb-1 gap-4 block">
            Role
          </label>
          <div className="relative">
            <ShieldPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={assignedRole}
              onChange={(e) => setAssignedRole(e.target.value)}
              className="w-full pl-10 pr-4 text-sm py-2 text-gray-700 border border-gray-200 rounded-md focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary transition-all duration-200 appearance-none bg-white"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Admin Rights */}
      <div className="space-y-3 mt-5">
        <label className="text-sm font-bold text-gray-700 block">
          Admin Rights
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {adminRightOptions.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-[#f0f0f0] transition-colors duration-200"
            >
              <input
                type="checkbox"
                value={option}
                checked={selectedRights.includes(option)}
                onChange={() => handleRightChange(option)}
                className="rounded border-gray-300 text-admin-primary focus:ring-admin-primary"
              />
              <span className="text-sm text-gray-600">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex space-x-4  mt-5">
        <button
          type="submit"
          onClick={handleSubmit}
          className=" bg-purple  hover:bg-purple/90  text-white py-2 px-10 rounded-md  transition-colors duration-200 disabled:opacity-50"
        >
          Save Details
        </button>
      </div>
    </div>
  );
};

export default AdminDetails;
