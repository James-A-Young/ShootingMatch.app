"use client";
import { useEffect, useState } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
  
export default function ProfilePageWrapper() {
  return (
    <SessionProvider>
      <ProfilePage />
    </SessionProvider>
  );
}

export function ProfilePage() {
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [form, setForm] = useState({
    displayName: "",
    placeOfBirth: "",
    dateOfBirth: "",
    address: "",
    facNumber: "",
    facExpiry: "",
    sgcNumber: "",
    sgcExpiry: ""
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/register");
      return;
    }
    fetch("/api/profile", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          displayName: data.displayName || "",
          placeOfBirth: data.placeOfBirth || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : "",
          address: data.address || "",
          facNumber: data.facNumber || "",
          facExpiry: data.facExpiry ? data.facExpiry.substring(0, 10) : "",
          sgcNumber: data.sgcNumber || "",
          sgcExpiry: data.sgcExpiry ? data.sgcExpiry.substring(0, 10) : ""
        });
        setLoading(false);
      });
  }, [session, status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });
    setLoading(false);
    if (res.ok) {
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully."
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              type="text"
              name="displayName"
              id="displayName"
              value={form.displayName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="placeOfBirth">Place of Birth</Label>
            <Input
              type="text"
              name="placeOfBirth"
              id="placeOfBirth"
              value={form.placeOfBirth}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              type="text"
              name="address"
              id="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="facNumber">FAC Number</Label>
            <Input
              type="text"
              name="facNumber"
              id="facNumber"
              value={form.facNumber}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="facExpiry">FAC Expiry</Label>
            <Input
              type="date"
              name="facExpiry"
              id="facExpiry"
              value={form.facExpiry}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="sgcNumber">SGC Number</Label>
            <Input
              type="text"
              name="sgcNumber"
              id="sgcNumber"
              value={form.sgcNumber}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="sgcExpiry">SGC Expiry</Label>
            <Input
              type="date"
              name="sgcExpiry"
              id="sgcExpiry"
              value={form.sgcExpiry}
              onChange={handleChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
