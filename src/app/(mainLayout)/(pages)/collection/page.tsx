"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/app/config/FireBaseConfig";
import { defaultForm, CollectionForm, Item } from "@/app/Types/CollectionTypes";
import { MdDelete, MdEdit } from "react-icons/md";
import CollectionInput from "@/app/components/CollectionInput";
import SearchBar from "@/app/components/SearchBar";
import { MoonLoader } from "react-spinners";
import { useUser } from "@/app/context/AuthContext";
import Image from "next/image";

function Page() {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [form, setForm] = useState<CollectionForm>(defaultForm);
  const [funkoPops, setFunkoPops] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>("");
  const [filteredList, setFilteredList] = useState<Item[]>([]);

  const { user } = useUser();

  const fetchFunkos = async () => {
    const snapshot = await getDocs(collection(db, "funkopops"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().name,
      ...doc.data(),
    })) as Item[];
    setFunkoPops(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchFunkos();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const totalItems = filteredList.length;

  const totalSpent = filteredList.reduce(
    (sum, item) => sum + (item.totalCost || 0),
    0
  );

  const totalEarned = filteredList.reduce(
    (sum, item) => sum + (item.soldPrice || 0),
    0
  );

  const totalProfit = totalEarned - totalSpent;

  const soldCount = filteredList.filter(
    (item) => item.soldPrice !== null && item.soldPrice !== undefined
  ).length;

  const activeCount = filteredList.filter(
    (item) => item.soldPrice === null || item.soldPrice === undefined
  ).length;

  useEffect(() => {
    if (showModal || deleteTarget) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal, deleteTarget]);

  const resetForm = () => {
    setForm(defaultForm);
    setEditing(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? value === "" || value === "-"
            ? value
            : Number(value)
          : value,
    }));
  };

  const convertFormToFirebaseObject = (
    form: CollectionForm
  ): Record<string, any> => ({
    name: form.name,
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
    marketBought: form.marketBought || "",
    marketSold: form.marketSold || "",
    transport: form.transport || "",
    fromAddress: form.fromAddress || "",
    toAddress: form.toAddress || "",
    extra: form.extra || "",
    imageUrl: form.imageUrl || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newEntry = convertFormToFirebaseObject(form);

    try {
      if (editing?.id) {
        await updateDoc(doc(db, "funkopops", editing.id), newEntry);
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

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <MoonLoader size={80} color="#f99b59" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold bg-primary p-2 rounded-lg text-surface">
          Collection
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-secondary text-surface text-lg px-4 py-2 rounded"
        >
          + Add
        </button>
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <SearchBar
          value={searchWord}
          onChange={setSearchWord}
          items={funkoPops}
          onFiltered={setFilteredList}
        />

        <div className="text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded shadow space-y-1">
          <div>
            <strong>Total items:</strong> {totalItems}
          </div>
          <div>
            <strong>Sold:</strong> {soldCount} | <strong>Active:</strong>{" "}
            {activeCount}
          </div>
          <div>
            <strong>Spent:</strong> {totalSpent} kr
          </div>
          <div>
            <strong>Earned:</strong> {totalEarned} kr
          </div>
          <div>
            <strong>Profit:</strong> {totalProfit} kr
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-start justify-center pt-18  pb-16 bg-black/50 overflow-hidden">
          <div className="bg-white p-6 rounded shadow max-w-md w-full m-8 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editing ? "Edit Funko Pop" : "Add Funko Pop"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <CollectionInput form={form} onChange={handleChange} />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded hover:bg-danger hover:text-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-secondary text-surface px-4 py-2 rounded"
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
              <strong>{deleteTarget.title}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border rounded hover:bg-danger hover:text-surface"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!deleteTarget.id) return;
                  await deleteDoc(doc(db, "funkopops", deleteTarget.id));
                  setDeleteTarget(null);
                  fetchFunkos();
                }}
                className="px-4 py-2 bg-danger hover:bg-danger-hover text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((pop) => {
          const profit =
            pop.soldPrice !== undefined && pop.soldPrice !== null
              ? pop.soldPrice - pop.totalCost!
              : null;

          return (
            <div
              key={pop.id}
              className="border rounded-lg shadow p-4 bg-white flex flex-col items-start"
            >
              {pop.imageUrl && (
                <Image
                  src={pop.imageUrl}
                  alt={pop.title}
                  className="rounded mb-4 max-h-48 object-contain w-full"
                  width={200}
                  height={200}
                />
              )}
              <h3 className="font-bold text-lg mb-2">{pop.title}</h3>

              <div className="w-full border-t border-gray-200 pt-2 space-y-1 text-sm">
                <div className="space-y-1">
                  <div className="font-semibold text-gray-600">Purchase</div>
                  <div className="flex gap-1">
                    <span className="font-semibold">Bought:</span>
                    <span>{pop.boughtPrice} kr</span>
                  </div>
                  {pop.dateBought && (
                    <div>
                      Bought on: {pop.dateBought.toDate().toLocaleDateString()}
                    </div>
                  )}
                  {pop.marketBought && <div>Market: {pop.marketBought}</div>}
                </div>

                {(pop.transport ||
                  pop.petrolCost ||
                  pop.fromAddress ||
                  pop.toAddress) && (
                  <>
                    <hr className="my-2 border-gray-300" />
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-600">
                        Transport / Shipping
                      </div>
                      {pop.transport && <div>Method: {pop.transport}</div>}
                      {pop.petrolCost !== undefined && (
                        <div>Petrol/Shipping: {pop.petrolCost} kr</div>
                      )}
                      {pop.fromAddress && <div>From: {pop.fromAddress}</div>}
                      {pop.toAddress && <div>To: {pop.toAddress}</div>}
                    </div>
                  </>
                )}

                {pop.soldPrice !== undefined && pop.soldPrice !== null && (
                  <>
                    <hr className="my-2 border-gray-300" />
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-600">Sale</div>
                      <div className="flex gap-1">
                        <span className="font-semibold">Sold:</span>
                        <span>{pop.soldPrice} kr</span>
                      </div>
                      {pop.dateSold && (
                        <div>
                          Sold on: {pop.dateSold.toDate().toLocaleDateString()}
                        </div>
                      )}
                      {pop.marketSold && (
                        <div>Market Sold: {pop.marketSold}</div>
                      )}
                    </div>
                  </>
                )}

                {(pop.totalCost || profit !== null || pop.extra) && (
                  <>
                    <hr className="my-2 border-gray-300" />
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-600">Summary</div>
                      {pop.extra && <div>Extra: {pop.extra}</div>}
                      {pop.totalCost !== undefined && (
                        <div>Total Cost: {pop.totalCost} kr</div>
                      )}
                      {profit !== null && (
                        <div className="flex gap-2 items-center mt-1 bg-green-100 px-2 py-1 rounded">
                          <span className="font-bold text-green-700">
                            Profit:
                          </span>
                          <span className="font-bold text-green-700">
                            {profit} kr
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2 mt-auto pt-4">
                <button
                  onClick={() => {
                    setEditing(pop);
                    setForm({
                      name: pop.title,
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
                  className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => setDeleteTarget(pop)}
                  className="px-3 py-1 bg-danger text-white rounded hover:bg-danger-hover"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Page;
