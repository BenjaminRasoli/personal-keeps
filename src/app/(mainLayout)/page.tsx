"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import { app } from "../config/FireBaseConfig";

const db = getFirestore(app);

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    boughtPrice: "",
    soldPrice: "",
    dateBought: "",
    dateSold: "",
    marketBought: "",
    marketSold: "",
    transport: "" as "drive" | "shipping" | "",
    petrolCost: "",
    fromAddress: "",
    toAddress: "",
    extra: "",
    totalCost: "",
    imageUrl: "",
    isSold: false,
  });

  const [funkoPops, setFunkoPops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFunkos = async () => {
    const snapshot = await getDocs(collection(db, "funkopops"));
    setFunkoPops(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchFunkos();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      boughtPrice: "",
      soldPrice: "",
      dateBought: "",
      dateSold: "",
      marketBought: "",
      marketSold: "",
      transport: "",
      petrolCost: "",
      fromAddress: "",
      toAddress: "",
      extra: "",
      totalCost: "",
      imageUrl: "",
      isSold: false,
    });
    setEditing(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newEntry = {
      ...form,
      boughtPrice: parseFloat(form.boughtPrice || "0"),
      soldPrice: form.isSold ? parseFloat(form.soldPrice || "0") : null,
      totalCost: parseFloat(form.totalCost || "0"),
      petrolCost: parseFloat(form.petrolCost || "0"),
      dateBought: form.dateBought
        ? Timestamp.fromDate(new Date(form.dateBought))
        : null,
      dateSold:
        form.isSold && form.dateSold
          ? Timestamp.fromDate(new Date(form.dateSold))
          : null,
    };

    try {
      if (editing) {
        const ref = doc(db, "funkopops", editing.id);
        await updateDoc(ref, newEntry);
      } else {
        await addDoc(collection(db, "funkopops"), newEntry);
      }
      fetchFunkos();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Funko Pops</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-surface px-4 py-2 rounded"
        >
          + Add
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-start justify-center pt-16 pb-16 bg-black/50 overflow-auto">
          <div className="bg-white p-6 rounded shadow max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editing ? "Edit Funko Pop" : "Add Funko Pop"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                name="name"
                type="text"
                placeholder="Funko Pop Name"
                value={form.name}
                onChange={handleChange}
                required
                className="border px-3 py-2 rounded"
              />
              <input
                name="boughtPrice"
                type="number"
                placeholder="Bought Price (kr)"
                value={form.boughtPrice}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
              <input
                name="dateBought"
                type="date"
                value={form.dateBought}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
              <input
                name="marketBought"
                type="text"
                placeholder="Market Bought"
                value={form.marketBought}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />

              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  name="isSold"
                  checked={form.isSold}
                  onChange={handleChange}
                />
                Sold now
              </label>

              {form.isSold && (
                <>
                  <input
                    name="soldPrice"
                    type="number"
                    placeholder="Sold Price (kr)"
                    value={form.soldPrice}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                  />
                  <input
                    name="dateSold"
                    type="date"
                    value={form.dateSold}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                  />
                  <input
                    name="marketSold"
                    type="text"
                    placeholder="Market Sold"
                    value={form.marketSold}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                  />
                </>
              )}

              <div className="flex gap-4 mt-2">
                <label>
                  <input
                    type="radio"
                    name="transport"
                    value="drive"
                    checked={form.transport === "drive"}
                    onChange={handleChange}
                  />{" "}
                  Drove
                </label>
                <label>
                  <input
                    type="radio"
                    name="transport"
                    value="shipping"
                    checked={form.transport === "shipping"}
                    onChange={handleChange}
                  />{" "}
                  Shipping
                </label>
              </div>

              {form.transport === "drive" && (
                <>
                  <input
                    name="petrolCost"
                    type="number"
                    placeholder="Petrol cost (kr)"
                    value={form.petrolCost}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                  />
                  <input
                    name="fromAddress"
                    type="text"
                    placeholder="From address"
                    value={form.fromAddress}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                  />
                  <input
                    name="toAddress"
                    type="text"
                    placeholder="To address"
                    value={form.toAddress}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                  />
                </>
              )}

              {form.transport === "shipping" && (
                <input
                  name="petrolCost"
                  type="number"
                  placeholder="Shipping cost (kr)"
                  value={form.petrolCost}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded"
                />
              )}

              <input
                name="extra"
                type="text"
                placeholder="Extra (voucher, etc.)"
                value={form.extra}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
              <input
                name="totalCost"
                type="number"
                placeholder="Total cost (kr)"
                value={form.totalCost}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
              <input
                name="imageUrl"
                type="text"
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-surface px-4 py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteDoc(doc(db, "funkopops", deleteTarget.id));
                  setDeleteTarget(null);
                  fetchFunkos();
                }}
                className="px-4 py-2 bg-danger text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {funkoPops.map((pop) => {
          const profit = pop.soldPrice ? pop.soldPrice - pop.boughtPrice : null;

          return (
            <div
              key={pop.id}
              className="border rounded-lg shadow p-4 bg-white flex flex-col items-start"
            >
              {pop.imageUrl && (
                <img
                  src={pop.imageUrl}
                  alt={pop.name}
                  className="rounded mb-4 max-h-48 object-contain w-full"
                />
              )}
              <h3 className="font-bold text-lg mb-2">{pop.name}</h3>

              <div className="w-full border-t border-gray-200 pt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">Bought:</span>
                  <span>{pop.boughtPrice} kr</span>
                </div>
                {pop.dateBought && (
                  <div>
                    Bought on: {pop.dateBought.toDate().toLocaleDateString()}
                  </div>
                )}
                {pop.marketBought && <div>Market: {pop.marketBought}</div>}
                {pop.transport && <div>Transport: {pop.transport}</div>}
                {pop.fromAddress && <div>From: {pop.fromAddress}</div>}
                {pop.toAddress && <div>To: {pop.toAddress}</div>}
                {pop.petrolCost !== undefined && (
                  <div>Petrol/Shipping: {pop.petrolCost} kr</div>
                )}
                {pop.extra && <div>Extra: {pop.extra}</div>}
                {pop.totalCost !== undefined && (
                  <div>Total Cost: {pop.totalCost} kr</div>
                )}

                {pop.soldPrice && (
                  <>
                    <div className="flex justify-between mt-1">
                      <span className="font-semibold">Sold:</span>
                      <span>{pop.soldPrice} kr</span>
                    </div>
                    {pop.dateSold && (
                      <div>
                        Sold on: {pop.dateSold.toDate().toLocaleDateString()}
                      </div>
                    )}
                    {pop.marketSold && <div>Market Sold: {pop.marketSold}</div>}
                    {profit !== null && (
                      <div className="flex justify-between mt-1 bg-green-100 px-2 py-1 rounded">
                        <span className="font-bold text-green-700">
                          Profit:
                        </span>
                        <span className="font-bold text-green-700">
                          {profit} kr
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setEditing(pop);
                    setForm({
                      name: pop.name,
                      boughtPrice: pop.boughtPrice?.toString() || "",
                      soldPrice: pop.soldPrice?.toString() || "",
                      dateBought: pop.dateBought
                        ? pop.dateBought.toDate().toISOString().split("T")[0]
                        : "",
                      dateSold: pop.dateSold
                        ? pop.dateSold.toDate().toISOString().split("T")[0]
                        : "",
                      marketBought: pop.marketBought || "",
                      marketSold: pop.marketSold || "",
                      transport: pop.transport || "",
                      petrolCost: pop.petrolCost?.toString() || "",
                      fromAddress: pop.fromAddress || "",
                      toAddress: pop.toAddress || "",
                      extra: pop.extra || "",
                      totalCost: pop.totalCost?.toString() || "",
                      imageUrl: pop.imageUrl || "",
                      isSold: !!pop.soldPrice,
                    });
                    setShowModal(true);
                  }}
                  className="px-3 py-1 bg-accent text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(pop)}
                  className="px-3 py-1 bg-danger text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
