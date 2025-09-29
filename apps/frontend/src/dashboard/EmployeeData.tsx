import { TbEdit } from "react-icons/tb";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useEmployeeData } from "@repo/zustand";
import axios from "axios";
import { toast } from "sonner";
import { PuffLoader } from "react-spinners";
import { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";

interface InputForm {
  name?: string;
  email?: string;
  position?: string;
}

export default function EmployeeData() {
  const {
    allEmployees,
    deleteEmployee,
    isLoading,
    setIsLoading,
    updateEmployee,
  } = useEmployeeData();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  console.log(allEmployees);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<InputForm>();

  const handleDelete = async (empId: any) => {
    try {
      setIsLoading(true);
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/data/${empId}`,
      );
      if (res.data.success) {
        deleteEmployee(empId);
        toast.success(res.data.msg);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data.msg || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const clickEditForId = (id: string) => {
    const emp = allEmployees.find((e) => e.id === id);
    if (!emp) return toast.error("Employee not found");
    reset({
      name: emp.name ?? "",
      email: emp.email ?? "",
      position: emp.position ?? "",
    });
    setEditId(id);
    setIsOpen(true);
  };

  const submittHandler = async (data: InputForm) => {
    if (!editId) {
      toast.error("No employee selected");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URI}/data/update/${editId}`,
        data,
      );
      if (res.data?.success) {
        toast.success(res.data.msg || "Updated");
        updateEmployee(editId, data);
        reset();
        setIsOpen(false);
        setEditId(null);
      } else {
        toast.error(res.data?.msg || "Update failed");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.msg || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const filterData = allEmployees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()),
  );

  console.log(allEmployees);

  return (
    <div className="bg-gray-200 border border-gray-700 h-screen mt-5 rounded-2xl">
      <div className=" flex justify-between items-center mx-8 mt-2 font-sans">
        <h1 className="text-2xl font-bold text-gray-700">Employees</h1>
        <div className="p-2 flex justify-center items-center gap-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Employee Here"
            className="bg-gray-300 text-black py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors"
          />
          <p className="text-2xl font-bold text-gray-700">
            Count: {allEmployees.length > 1000 ? "1000+" : allEmployees.length}
          </p>
        </div>
      </div>
      <span className="block h-[1px] bg-gradient-to-r from-transparent via-neutral-400 to-transparent rounded-2xl mt-2.5" />
      <div>
        {filterData.length > 0 ? (
          filterData.map((emp, idx) => (
            <div className="max-w-7xl mx-auto mt-4" key={idx}>
              <div className="flex flex-wrap justify-between items-center gap-4 mx-4 border py-3 px-4 rounded-xl bg-gray-300">
                <p className="text-gray-900 text-lg font-semibold px-3 py-1 border border-gray-400 rounded-full">
                  {idx + 1}
                </p>

                <h2 className="flex-1 text-gray-900 text-lg font-semibold truncate">
                  {emp.name}
                </h2>

                <h2 className="flex-1 text-gray-900 text-lg font-semibold truncate">
                  {emp.email}
                </h2>

                <h2 className="flex-1 text-gray-900 text-lg font-semibold truncate">
                  {emp.position}
                </h2>

                <div className="flex gap-2 shrink-0">
                  {isOpen && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                      onClick={() => {
                        setIsOpen(false);
                        setEditId(null);
                      }}
                    >
                      <div
                        className="rounded-lg p-6 w-96 relative bg-gray-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            setEditId(null);
                          }}
                          className="px-4 py-2 font-semibold rounded cursor-pointer absolute right-0 top-0"
                          aria-label="Close"
                        >
                          <MdOutlineCancel
                            size={22}
                            className="hover:text-red-400"
                          />
                        </button>
                        <h1 className="text-2xl font-bold text-center">
                          Update Details
                        </h1>
                        <p className="text-md mt-2 text-center font-semibold text-gray-500">
                          You can edit all the fields or one or two
                        </p>
                        <form onSubmit={handleSubmit(submittHandler)}>
                          <div className="flex items-center mt-6">
                            <label className="text-xl font-bold w-[30%]">
                              Name
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Your Name"
                              className="px-4 py-1.5 rounded w-[70%] border border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors"
                              {...register("name")}
                            />
                          </div>
                          {errors.name && (
                            <p className="text-red-500 text-sm">
                              {errors.name.message}
                            </p>
                          )}

                          <div className="flex items-center mt-4">
                            <label className="text-xl font-bold w-[30%]">
                              Email
                            </label>
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
                    className="px-4 py-2 border border-gray-500 rounded cursor-pointer text-black hover:bg-gray-400 hover:text-green-900"
                    onClick={() => clickEditForId(emp.id)}
                  >
                    <TbEdit size={20} />
                  </button>
                  <button
                    className="px-4 py-2 border border-gray-500 rounded cursor-pointer text-black hover:bg-gray-400 hover:text-red-900"
                    onClick={() => handleDelete(emp.id)}
                  >
                    {isLoading ? (
                      <PuffLoader size={20} />
                    ) : (
                      <RiDeleteBin6Fill size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-2xl uppercase mt-20 text-gray-500 font-bold">
            no employee data found
          </div>
        )}
      </div>
    </div>
  );
}
