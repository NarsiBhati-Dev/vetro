import Logo from "./Logo";
import { useEmployeeData } from "@repo/zustand";
import { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { PuffLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";

interface AddEmployee {
  name: string;
  email: string;
  position: string;
}

export default function Navbar() {
  const { addEmployee, isLoading, setIsLoading } = useEmployeeData();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AddEmployee>();

  const [isOpen, setIsOpen] = useState(false);

  const submitData = async (data: AddEmployee) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/data/`,
        data,
      );
      if (res.data?.success) {
        toast.success(res.data.msg || "Employee Added Successfully");
        addEmployee({ ...data, id: res.data.id });
        reset();
        setIsOpen(false);
      } else {
        toast.error(res.data?.msg || "Something went wrong");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.msg || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-gradient from-sky-200 via-white to-sky-100 border border-gray-700 rounded-xl p-4 relative">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex items-center gap-3 px-2">
          {isOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/40 backdrop-blur-sm"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <div
                className="rounded-lg p-6 w-96 relative bg-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 font-semibold rounded cursor-pointer absolute right-0 top-0"
                  aria-label="Close"
                >
                  <MdOutlineCancel size={22} className="hover:text-red-400" />
                </button>
                <h1 className="text-2xl font-bold text-center">
                  Add New Employee
                </h1>
                <form onSubmit={handleSubmit(submitData)}>
                  <div className="flex items-center mt-6">
                    <label className="text-xl font-bold w-[30%]">Name</label>
                    <input
                      type="text"
                      placeholder="Enter Your Name"
                      className="px-4 py-1.5 rounded w-[70%] border border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center mt-4">
                    <label className="text-xl font-bold w-[30%]">Email</label>
                    <input
                      type="email"
                      placeholder="Enter Your Email"
                      className="px-4 py-1.5 rounded w-[70%] border border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}

                  <div className="flex items-center mt-4">
                    <label className="text-xl font-bold w-[30%]">
                      Position
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Your Position"
                      className="px-4 py-1.5 rounded w-[70%] border border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors"
                      {...register("position")}
                    />
                  </div>
                  {errors.position && (
                    <p className="text-red-500 text-sm">
                      {errors.position.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-500 cursor-pointer font-semibold hover:bg-sky-600 text-white rounded w-full mt-5"
                  >
                    {isLoading ? <PuffLoader size={16} /> : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          )}
          <button
            className="cursor-pointer px-6 py-5.5 hover:bg-gray-700"
            onClick={() => setIsOpen(true)}
          >
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
}
