"use client";
import React, { useState, useEffect } from "react";
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

interface Company {
  id: number;
  name: string;
  address: string;
  phone: number;
  email: string;
  notes?: string | null;
  primaryContact: string;
  users?: any[];
}

const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Company>({
    id: 0,
    name: "",
    address: "",
    phone: 0,
    email: "",
    notes: "",
    primaryContact: "",
    users: [],
  });

  // Function to fetch companies and update state
  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/companies");
      if (!response.ok) {
        console.error("Failed to fetch companies:", response.statusText);
        return;
      }
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? Number(value) : value,
    }));
  };

  const handleAddCompany = async () => {
    const { id, ...dataToSend } = formData;
    await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });
    setFormData({
      id: 0,
      name: "",
      address: "",
      phone: 0,
      email: "",
      notes: "",
      primaryContact: "",
    });
    fetchCompanies(); // Refresh company list after adding
  };

  const handleEditCompany = (company: Company) => {
    setIsEditing(true);
    setFormData(company);
  };

  const handleUpdateCompany = async () => {
    await fetch(`/api/companies/${formData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setIsEditing(false);
    setFormData({
      id: 0,
      name: "",
      address: "",
      phone: 0,
      email: "",
      notes: "",
      primaryContact: "",
    });
    fetchCompanies(); // Refresh company list after updating
  };

  const handleDeleteCompany = async (id: number) => {
    await fetch(`/api/companies/${id}`, { method: "DELETE" });
    fetchCompanies(); // Refresh company list after deleting
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      id: 0,
      name: "",
      address: "",
      phone: 0,
      email: "",
      notes: "",
      primaryContact: "",
    });
  };

  // Define columns for TanStack Table
  const columns: ColumnDef<Company>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditCompany(row.original)}
            className="text-blue-500"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteCompany(row.original.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: companies,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Company Management</h1>

      {/* Form for Adding/Editing Companies */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <Input
          type="text"
          name="name"
          placeholder="Company Name"
          value={formData.name}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <Input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
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
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <Input
          type="text"
          name="primaryContact"
          placeholder="Primary Contact"
          value={formData.primaryContact}
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
        {isEditing ? (
          <>
            <Button
              onClick={handleUpdateCompany}
              className="bg-blue-500 text-white px-4 py-2"
            >
              Update
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
            onClick={handleAddCompany}
            className="bg-green-500 text-white px-4 py-2"
          >
            Add
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
};

export default CompaniesPage;
