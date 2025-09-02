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
import { MediaForm, MediaFormWithId } from "@/app/Types/MediaForm";
import { MdDelete, MdEdit } from "react-icons/md";
import SearchBar from "@/app/components/SearchBar";
import { MediaItem } from "@/app/Types/MediaItem";

function Page() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<MediaForm>({
    tmdbId: "",
    type: "movie",
    startDate: "",
    endDate: "",
    watchedAgain: [],
    seasons: [],
  });
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [filteredList, setFilteredList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>("");

  const fetchMedia = async () => {
    const snapshot = await getDocs(collection(db, "media"));
    const data: MediaFormWithId[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as MediaForm),
    }));

    const enhanced: any = await Promise.all(
      data.map(async (item) => {
        try {
          const res = await fetch(
            `/api/tmdb?tmdbId=${item.tmdbId}&type=${item.type}`
          );
          const json = await res.json();
          return {
            ...item,
            id: item.id,
            title: json.title || json.name,
            image: json.poster_path,
          };
        } catch {
          return { ...item, id: item.id, title: item.tmdbId, image: "" };
        }
      })
    );
    setMediaList(enhanced);
    setFilteredList(enhanced);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const resetForm = () => {
    setForm({
      tmdbId: "",
      type: "movie",
      startDate: "",
      endDate: "",
      watchedAgain: [{ start: "", end: "" }],
      seasons: [],
    });
    setEditing(null);
  };

  const addWatchedAgain = () => {
    setForm((prev) => ({
      ...prev,
      watchedAgain: [...prev.watchedAgain, { start: "", end: "" }],
    }));
  };

  const handleWatchedAgainChange = (
    index: number,
    key: "start" | "end",
    value: string
  ) => {
    const newWatched = [...form.watchedAgain];
    newWatched[index][key] = value;
    setForm((prev) => ({ ...prev, watchedAgain: newWatched }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "type" && value === "show" && form.seasons.length === 0) {
      setForm((prev) => ({
        ...prev,
        seasons: [{ seasonNumber: 1, start: "", end: "" }],
      }));
    }
  };

  const handleSeasonChange = (
    index: number,
    key: "start" | "end",
    value: string
  ) => {
    const newSeasons = [...form.seasons];
    newSeasons[index][key] = value;
    setForm((prev) => ({ ...prev, seasons: newSeasons }));
  };

  const addSeason = () => {
    setForm((prev) => ({
      ...prev,
      seasons: [
        ...prev.seasons,
        { seasonNumber: prev.seasons.length + 1, start: "", end: "" },
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newEntry = {
      ...form,
      watchedAgain: form.watchedAgain.map((w) => ({
        start: w.start ? Timestamp.fromDate(new Date(w.start)) : null,
        end: w.end ? Timestamp.fromDate(new Date(w.end)) : null,
      })),
      seasons: form.seasons.map((s) => ({
        seasonNumber: s.seasonNumber,
        start: s.start ? Timestamp.fromDate(new Date(s.start)) : null,
        end: s.end ? Timestamp.fromDate(new Date(s.end)) : null,
      })),
    };

    try {
      if (editing) {
        const ref = doc(db, "media", editing.id);
        await updateDoc(ref, newEntry);
      } else {
        await addDoc(collection(db, "media"), newEntry);
      }
      fetchMedia();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (media: any) => {
    setForm({
      tmdbId: media.tmdbId,
      type: media.type,
      startDate: media.startDate
        ? media.startDate.toDate().toISOString().split("T")[0]
        : "",
      endDate: media.endDate
        ? media.endDate.toDate().toISOString().split("T")[0]
        : "",
      watchedAgain:
        media.watchedAgain?.length > 0
          ? media.watchedAgain.map((w: any) => ({
              start: w.start
                ? w.start.toDate().toISOString().split("T")[0]
                : "",
              end: w.end ? w.end.toDate().toISOString().split("T")[0] : "",
            }))
          : [
              {
                start: media.startDate
                  ? media.startDate.toDate().toISOString().split("T")[0]
                  : "",
                end: media.endDate
                  ? media.endDate.toDate().toISOString().split("T")[0]
                  : "",
              },
            ],
      seasons: media.seasons || [],
    });
    setEditing(media);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (deleteModal.id) {
      await deleteDoc(doc(db, "media", deleteModal.id));
      fetchMedia();
      setDeleteModal({ open: false, id: null });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Media Tracker</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary hover:bg-accent text-surface px-4 py-2 rounded"
        >
          + Add Media
        </button>
      </div>
      <div className="flex justify-between">
        <SearchBar
          value={searchWord}
          onChange={setSearchWord}
          items={mediaList}
          onFiltered={setFilteredList}
        />
        <div className=" text-surface text-lg space-x-4">
          <span>
            Movies: {mediaList.filter((m) => m.type === "movie").length}
          </span>
          |{" "}
          <span>
            TV Shows: {mediaList.filter((m) => m.type === "show").length}
          </span>
          | <span>Total: {mediaList.length}</span>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-start justify-center pt-16 pb-16 bg-black/50 overflow-auto z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editing ? "Edit Media" : "Add Media"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="tmdbId"
                placeholder="TMDB ID"
                value={form.tmdbId}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
                required
              />
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              >
                <option value="movie">Movie</option>
                <option value="show">Show</option>
              </select>

              {form.type === "movie" &&
                form.watchedAgain.map((w, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <input
                      type="date"
                      value={w.start}
                      onChange={(e) =>
                        handleWatchedAgainChange(i, "start", e.target.value)
                      }
                      className="border px-3 py-2 rounded"
                      required
                    />
                    <input
                      type="date"
                      value={w.end}
                      onChange={(e) =>
                        handleWatchedAgainChange(i, "end", e.target.value)
                      }
                      className="border px-3 py-2 rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          watchedAgain: prev.watchedAgain.filter(
                            (_, idx) => idx !== i
                          ),
                        }))
                      }
                      className="bg-danger text-white px-2 py-1 rounded hover:opacity-70"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                ))}

              {form.type === "movie" && (
                <button
                  type="button"
                  onClick={addWatchedAgain}
                  className="bg-primary hover:bg-accent text-white px-2 py-1 rounded mb-2"
                >
                  Add Another Date
                </button>
              )}

              {form.type === "show" &&
                form.seasons.map((s, i) => (
                  <div
                    key={i}
                    className="border p-2 rounded flex flex-col gap-2"
                  >
                    <span className="font-semibold">
                      Season {s.seasonNumber}
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={s.start}
                        onChange={(e) =>
                          handleSeasonChange(i, "start", e.target.value)
                        }
                        className="border px-3 py-2 rounded"
                      />

                      <input
                        type="date"
                        value={s.end}
                        onChange={(e) =>
                          handleSeasonChange(i, "end", e.target.value)
                        }
                        className="border px-3 py-2 rounded"
                      />
                    </div>
                  </div>
                ))}
              {form.type === "show" && (
                <button
                  type="button"
                  onClick={addSeason}
                  className="bg-primary hover:bg-accent text-white px-2 py-1 rounded"
                >
                  Add Season
                </button>
              )}

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
                  className="bg-primary text-surface px-4 py-2 rounded hover:bg-accent"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <p className="mb-4">Are you sure you want to delete this media?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-danger text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredList.map((media) => (
          <div
            key={media.id}
            className="relative border rounded-lg shadow h-100 overflow-hidden flex flex-col justify-end"
          >
            {media.image && (
              <img
                src={`https://image.tmdb.org/t/p/w500${media.image}`}
                alt={media.title}
                className="w-full h-full object-cover object-center"
              />
            )}

            <div className="absolute top-2 right-2 z-20 flex gap-2">
              <button
                onClick={() => handleEdit(media)}
                className="px-2 py-1 bg-accent text-white rounded text-sm hover:opacity-50"
              >
                <MdEdit size={20} />
              </button>
              <button
                onClick={() => setDeleteModal({ open: true, id: media.id })}
                className="px-2 py-1 bg-danger text-white rounded text-sm hover:opacity-50"
              >
                <MdDelete size={20} />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/80 text-white">
              <h3 className="font-bold text-lg truncate mb-1">
                {media.title || "Untitled"}
              </h3>

              {media.type === "movie" && (
                <div className="text-sm">
                  {media.watchedAgain?.map((w: any, i: number) => (
                    <div key={i}>
                      {w.start?.toDate().toLocaleDateString()}
                      {w.end ? ` - ${w.end.toDate().toLocaleDateString()}` : ""}
                    </div>
                  ))}
                </div>
              )}

              {media.type === "show" && (
                <div className="text-sm overflow-y-auto max-h-24">
                  {media.seasons?.map((s: any) => (
                    <div key={s.seasonNumber}>
                      Season {s.seasonNumber}:{" "}
                      {s.start?.toDate().toLocaleDateString()}{" "}
                      {s.end ? `- ${s.end.toDate().toLocaleDateString()}` : ""}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
