import { NextResponse } from "next/server";
import { fetchFashionProducts, searchFashionProducts } from "@/lib/dummyjson";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const gender = searchParams.get("gender");
    const size = searchParams.get("size");
    const color = searchParams.get("color");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 999999;
    const limit = Number(searchParams.get("limit")) || 100;

    // Use search endpoint for text queries, otherwise fetch full catalog
    let products;
    if (search && search.trim().length >= 2) {
      products = await searchFashionProducts(search.trim(), 30);
    } else {
      products = await fetchFashionProducts({ limitPerCategory: 10 });
    }

    // Apply filters
    if (category && category !== "ALL") {
      products = products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      );
    }

    if (gender && gender !== "ALL") {
      products = products.filter(
        (p) =>
          p.gender.toLowerCase() === gender.toLowerCase() ||
          p.gender.toLowerCase() === "unisex",
      );
    }

    if (size && size !== "ALL") {
      products = products.filter((p) => p.sizes.includes(size));
    }

    if (color && color !== "ALL") {
      products = products.filter((p) =>
        p.colors.some((c) =>
          c.name.toLowerCase().includes(color.toLowerCase()),
        ),
      );
    }

    // Price range filter
    products = products.filter(
      (p) => p.price >= minPrice && p.price <= maxPrice,
    );

    // Sort
    switch (sort) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
        products.sort(
          (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0),
        );
        break;
      case "newest":
      default:
        products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    // Apply limit
    const paginated = products.slice(0, limit);

    return NextResponse.json(
      {
        success: true,
        total: paginated.length,
        source: "dummyjson",
        products: paginated,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("[/api/products] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products from DummyJSON" },
      { status: 500 },
    );
  }
}
