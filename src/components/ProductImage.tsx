import { PLACEHOLDER_ICONS, type Product } from "@/lib/store";

export default function ProductImage({
  product,
  className,
  iconSize = "h-10 w-10",
}: {
  product: Product;
  className?: string;
  iconSize?: string;
}) {
  const image = product.images[0];
  if (image) {
    return (
      <img
        src={image}
        alt={product.title}
        loading="lazy"
        className={`h-full w-full object-cover ${className ?? ""}`}
      />
    );
  }
  const Icon = PLACEHOLDER_ICONS[product.placeholder.iconKey] ?? PLACEHOLDER_ICONS.Box;
  return (
    <div
      className={`grid h-full w-full place-items-center bg-gradient-to-br ${product.placeholder.gradient} ${className ?? ""}`}
    >
      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/10 text-white/90 backdrop-blur-sm">
        <Icon className={iconSize} />
      </div>
    </div>
  );
}
