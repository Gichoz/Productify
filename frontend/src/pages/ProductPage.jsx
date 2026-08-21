import { ArrowLeftIcon, EditIcon, Trash2Icon, CalendarIcon, UserIcon, ExternalLinkIcon } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import CommentsSection from "../components/CommentsSection";
import { useAuth } from "@clerk/clerk-react";
import { useProduct, useDeleteProduct } from "../hooks/useProducts";
import { useParams, Link, useNavigate } from "react-router";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80";

function ProductPage() {
  const { id } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useProduct(id);
  const deleteProduct = useDeleteProduct();

  const handleDelete = () => {
    if (confirm("Delete this product permanently?")) {
      deleteProduct.mutate(id, { onSuccess: () => navigate("/") });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !product) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">Product not found</h2>
          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = userId === product.userId;
  const displayImage = product.imageUrl || product.image_url || DEFAULT_IMAGE;
  const userAvatar = product.user?.imageUrl || product.user?.image_url;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER CONTROLS */}
      <div className="flex items-center justify-between">
        <Link to="/" className="btn btn-ghost btn-sm gap-1">
          <ArrowLeftIcon className="size-4" /> Back
        </Link>
        {isOwner && (
          <div className="flex gap-2">
            <Link to={`/edit/${product.id}`} className="btn btn-ghost btn-sm gap-1">
              <EditIcon className="size-4" /> Edit
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-sm gap-1"
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Trash2Icon className="size-4" />
              )}
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* PRODUCT IMAGE */}
        <div className="card bg-base-300">
          <figure className="p-4">
            <img
              src={displayImage}
              alt={product.title || "Product image"}
              className="h-64 w-full object-cover rounded-xl"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_IMAGE;
              }}
            />
          </figure>
        </div>

        {/* DETAILS */}
        <div className="card bg-base-300">
          <div className="card-body">
            <h1 className="card-title text-2xl">{product.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-base-content/60 my-2">
              {product.createdAt && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="size-4" />
                  {new Date(product.createdAt).toLocaleDateString()}
                </div>
              )}
              {product.user?.name && (
                <div className="flex items-center gap-1">
                  <UserIcon className="size-4" />
                  {product.user.name}
                </div>
              )}
            </div>

            <div className="divider my-2"></div>

            <p className="text-base-content/80 leading-relaxed">{product.description}</p>

            {product.url && (
              <div className="mt-4">
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm gap-2"
                >
                  <ExternalLinkIcon className="size-4" /> View External Link
                </a>
              </div>
            )}

            {/* CREATOR PROFILE */}
            {product.user && (
              <>
                <div className="divider my-2"></div>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden flex items-center justify-center bg-base-200">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={product.user.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="size-6 text-base-content/60" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{product.user.name}</p>
                    <p className="text-xs text-base-content/50">Creator</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* COMMENTS */}
      <div className="card bg-base-300">
        <div className="card-body">
          <CommentsSection
            productId={id}
            comments={product.comments || []}
            currentUserId={userId}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;