import { Link } from "react-router";
import { UserIcon } from "lucide-react";

// Pure helper function defined OUTSIDE the component
const checkIfNew = (createdAt) => {
  if (!createdAt) return false;
  const SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;
  return Date.now() - new Date(createdAt).getTime() < SEVEN_DAYS_MS;
};

function ProductCard({ product }) {
  const rawImageUrl = product.imageUrl || product.image_url;
  const displayImage =
    typeof rawImageUrl === "string" && rawImageUrl.trim() !== ""
      ? rawImageUrl
      : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80";

  // Pure call inside component body
  const isNew = checkIfNew(product.createdAt);

  return (
    <Link
      to={`/product/${product.id}`}
      className="card bg-base-300 overflow-hidden group card-float-hover
                 transition-shadow duration-300 ease-out
                 hover:shadow-xl hover:shadow-primary/10
                 border border-transparent hover:border-primary/30"
    >
      {/* IMAGE */}
      <figure className="relative w-full h-48 bg-base-200 overflow-hidden">
        <img
          src={displayImage}
          alt={product.title || "Product image"}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80";
          }}
        />
      </figure>

      <div className="card-body p-4">
        {/* TITLE + NEW BADGE */}
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-base transition-colors duration-200 group-hover:text-primary">
            {product.title}
          </h3>
          {isNew && <span className="badge badge-primary badge-sm">NEW</span>}
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-base-content/60 line-clamp-1">{product.description}</p>

        <div className="divider my-1"></div>

        {/* CREATOR */}
        <div className="flex items-center gap-2">
          <div className="avatar">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              {product.user?.imageUrl || product.user?.image_url ? (
                <img
                  src={product.user.imageUrl || product.user.image_url}
                  alt={product.user?.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-primary/20 flex items-center justify-center h-full w-full">
                  <UserIcon className="size-3" />
                </div>
              )}
            </div>
          </div>
          <span className="text-sm text-base-content/70">{product.user?.name || "Unknown"}</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;