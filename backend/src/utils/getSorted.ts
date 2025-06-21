import { SortOptions } from "../types/types";

export function getSorted(sort: string | null): SortOptions { 
    if (!sort) {
        return { field: "createdAt", direction: "DESC" };
    }
    if (sort === "priceasc") {
        return { field: "price", direction: "ASC" };
    }
    if (sort === "pricedesc") {
        return { field: "price", direction: "DESC" };
    }
    if (sort === "rating") {
        return { field: "ratingRate", direction: "DESC" };
    }
    if (sort === "name") {
        return { field: "title", direction: "ASC" };
    }
    // Default return in case none of the conditions match
    return { field: "createdAt", direction: "DESC" };
}