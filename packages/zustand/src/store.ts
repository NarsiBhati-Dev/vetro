import { create } from "zustand";

interface Employees {
  id: string;
  name: string;
  email: string;
  position: string;
}

interface EmployeeStore {
  allEmployees: Employees[];
  isLoading: boolean;
  setIsLoading: (status: boolean) => void;
  setAllEmployees: (data: Employees[]) => void;
  addEmployee: (emp: Employees) => void;
  updateEmployee: (id: string, updated: Partial<Employees>) => void;
  deleteEmployee: (id: string) => void;
}

export const useEmployeeData = create<EmployeeStore>((set) => ({
  allEmployees: [],

  isLoading: false,

  setAllEmployees: (data) => set({ allEmployees: data }),

  setIsLoading: (status) => set({ isLoading: status }),

  //add employee with existing one's
  addEmployee: (emp) =>
    set((state) => ({
      allEmployees: [...state.allEmployees, emp],
    })),

  //update employe detailss
  updateEmployee: (id, updated) =>
    set((state) => ({
      allEmployees: state.allEmployees.map((emp) =>
        emp.id === id ? { ...emp, ...updated } : emp,
      ),
    })),

  //delete emp with id
  deleteEmployee: (id) =>
    set((state) => ({
      allEmployees: state.allEmployees.filter((emp) => emp.id !== id),
    })),
}));
