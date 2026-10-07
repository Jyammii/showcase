import { useState } from "react";
import ImageUpload from "./ImageUpload";

const emptyForm = { name: "", price: "", description: "", image: "" };

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white p-3 py-2 outline-none ring-1 " +
  "transition focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50";

function ProductForm({ editingProduct, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => editingProduct || emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, image } = form;
    if (!name.trim() || price === "" || !image) {
      return setError("Name, price, and image are required.");
    }
    setSaving(true);
    try {
      await onSubmit({ name, price: Number(price), description: form.description, image });
      setForm(emptyForm);
      setError("");
    } catch {
      setError("Could not save the product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
    >
      <h2 className="text-xl font-bold text-slate-900">
        {editingProduct ? "Edit Product" : "New Product"}
      </h2>

      <ImageUpload
        image={form.image}
        onChange={(image) => setForm({ ...form, image })}
        onError={(e) => setError(e)}
      />

      <input
        name="name"
        placeholder="Product name"
        className={inputClass}
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="price"
        type="number"
        min="0"
        placeholder="Price (₱)"
        className={inputClass}
        value={form.price}
        onChange={handleChange}
      />
      <textarea
        name="description"
        rows="3"
        placeholder="Short description"
        className={inputClass}
        value={form.description}
        onChange={handleChange}
      />

      {error && (
        <p className="rounded-xl bg-red-50 p-2 text-sm text-red-400">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-lg bg-indigo-600 py-3 font-semibold
            text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : editingProduct ? "Update" : "Add Product"}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg bg-slate-200 py-3 font-semibold
              text-slate-700 transition hover:bg-slate-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
