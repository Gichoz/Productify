import { useState } from "react";

function EditProductForm({ product, isPending, isError, onSubmit }) {
  const [formData, setFormData] = useState({
    title: product?.title ?? "",
    description: product?.description ?? "",
    imageUrl: product?.imageUrl || product?.image_url || "",
    price: product?.price ?? "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Include formData.price alongside title, description, and imageUrl
    onSubmit({
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      price: formData.price === "" ? null : Number(formData.price),
    });
  };

  return (
    <div className="card bg-base-300 max-w-lg mx-auto">
      <div className="card-body">
        <h2 className="card-title mb-4">Edit Product</h2>

        {isError && (
          <div className="alert alert-error mb-4">
            <span>Failed to update product. Please try again.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label htmlFor="title" className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="description" className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered h-24 w-full"
            />
          </div>

          <div className="form-control">
            <label htmlFor="imageUrl" className="label">
              <span className="label-text">Image URL</span>
            </label>
            <input
              id="imageUrl"
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* IMG PREVIEW */}
          {formData.imageUrl && (
            <div className="rounded-box overflow-hidden">
              <img
                key={formData.imageUrl}
                src={formData.imageUrl}
                alt="Preview"
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          <div className="form-control">
            <label htmlFor="price" className="label">
              <span className="label-text">Price</span>
            </label>
            <input
              id="price"
              type="number"
              name="price"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            disabled={isPending}
          >
            {isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EditProductFormWrapper(props) {
  return <EditProductForm key={props.product?.id} {...props} />;
}