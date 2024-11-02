"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface User {
  id: number;
  username: string;
  password: string;
  email?: string | null;
  notes?: string | null;
  phone?: number | null;
  companyId: number | null;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: 0,
    username: "",
    password: "",
    email: null,
    notes: null,
    phone: null,
    companyId: null,
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" || name === "companyId" ? Number(value) : value,
    }));
  };

  const handleAddUser = async () => {
    const { id, createdAt, ...dataToSend } = formData;

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
        return;
      }

      const newUser = await response.json();
      setUsers((prev) => [...prev, newUser]);

      setFormData({
        id: 0,
        username: "",
        password: "",
        email: null,
        notes: null,
        phone: null,
        companyId: null,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      alert("An unexpected error occurred.");
    }
  };

  const handleEdit = (user: User) => {
    setIsEditing(true);
    setFormData(user);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`/api/users/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
        return;
      }

      const updatedUser = await response.json();
      setUsers((prev) =>
        prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );

      setIsEditing(false);
      setFormData({
        id: 0,
        username: "",
        password: "",
        email: null,
        notes: null,
        phone: null,
        companyId: null,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      alert("An unexpected error occurred.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      id: 0,
      username: "",
      password: "",
      email: null,
      notes: null,
      phone: null,
      companyId: null,
      createdAt: new Date().toISOString(),
    });
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "companyId",
      header: "Company ID",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button onClick={() => handleEdit(row.original)}>Edit</Button>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Form for Adding/Editing Users */}
      <div className="mb-4 grid grid-cols-6 gap-2">
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password || ""}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email ?? ""}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <Input
          type="number"
          name="phone"
          placeholder="Phone"
          value={formData.phone || ""}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <Input
          type="text"
          name="notes"
          placeholder="Notes"
          value={formData.notes || ""}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <Input
          type="number"
          name="companyId"
          placeholder="Company ID"
          value={formData.companyId || ""}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        {isEditing ? (
          <>
            <Button
              onClick={handleUpdateUser}
              className="bg-blue-500 text-white px-4 py-2"
            >
              Update User
            </Button>
            <Button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2"
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            onClick={handleAddUser}
            className="bg-green-500 text-white px-4 py-2"
          >
            Add User
          </Button>
        )}
      </div>

      {/* Data Table */}
      <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
