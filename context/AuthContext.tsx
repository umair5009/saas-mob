import { createContext, ReactNode, useContext, useState } from 'react';

// Dummy user data
export const DUMMY_USERS = {
  students: [
    {
      id: 'STU001',
      email: 'alex@school.com',
      password: 'student123',
      name: 'Alex Johnson',
      role: 'student',
      class: '10-B',
      rollNo: '15',
      phone: '+1 234 567 8901',
      avatar: null,
      attendance: 85,
      gpa: 3.8,
    },
    {
      id: 'STU002',
      email: 'emma@school.com',
      password: 'student123',
      name: 'Emma Johnson',
      role: 'student',
      class: '8-A',
      rollNo: '08',
      phone: '+1 234 567 8902',
      avatar: null,
      attendance: 92,
      gpa: 3.5,
    },
    {
      id: 'STU003',
      email: 'michael@school.com',
      password: 'student123',
      name: 'Michael Johnson',
      role: 'student',
      class: '5-C',
      rollNo: '12',
      phone: '+1 234 567 8905',
      avatar: null,
      attendance: 78,
      gpa: 3.2,
    },
  ],
  parents: [
    {
      id: 'PAR001',
      email: 'parent@school.com',
      password: 'parent123',
      name: 'Robert Johnson',
      role: 'parent',
      phone: '+1 234 567 8903',
      children: ['STU001', 'STU002', 'STU003'], // Parent with 3 children
      avatar: null,
    },
    {
      id: 'PAR002',
      email: 'mary@school.com',
      password: 'parent123',
      name: 'Mary Williams',
      role: 'parent',
      phone: '+1 234 567 8904',
      children: ['STU002'],
      avatar: null,
    },
  ],
};

// Helper function to get children data for a parent
export const getChildrenData = (childrenIds: string[]) => {
  return DUMMY_USERS.students.filter((student) =>
    childrenIds.includes(student.id)
  );
};

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'parent';
  class?: string;
  rollNo?: string;
  phone?: string;
  children?: string[];
  avatar?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: 'student' | 'parent' | null;
  login: (email: string, password: string, role: 'student' | 'parent') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'parent' | null>(null);

  const login = async (
    email: string,
    password: string,
    role: 'student' | 'parent'
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users = role === 'student' ? DUMMY_USERS.students : DUMMY_USERS.parents;
    const foundUser = users.find(
      (u) => (u.email.toLowerCase() === email.toLowerCase() || u.id.toLowerCase() === email.toLowerCase()) && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      setUserRole(role);
      return { success: true };
    }

    return { success: false, error: 'Invalid email/ID or password' };
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        userRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
