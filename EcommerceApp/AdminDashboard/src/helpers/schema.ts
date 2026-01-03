import { z } from "zod";

export const VariationOptionSchema = z.object({
    id: z.string(), // uuid
    value: z.string().min(1, "Value is required"),
    image: z.string().optional(),
    displayOrder: z.number(),
});

export const VariationGroupSchema = z.object({
    id: z.string(), // uuid
    name: z.string().min(1, "Group name is required"),
    options: z.array(VariationOptionSchema),
});

export const ProductItemSchema = z.object({
    id: z.string(),
    sku: z.string(),
    price: z.number().min(0),
    stock: z.number().min(0),
    attribute1: z.string().optional(),
    attribute2: z.string().optional(),
    attribute1Id: z.string().optional(),
    attribute2Id: z.string().optional(),
    image: z.string().optional(),
});

export const ProductFormSchema = z.object({
    variations: z.array(VariationGroupSchema).max(2, "Maximum 2 variation groups"),
    items: z.array(ProductItemSchema),
    // Other fields are optional or handled loosely since we are merging with legacy form
});

export type VariationOption = z.infer<typeof VariationOptionSchema>;
export type VariationGroup = z.infer<typeof VariationGroupSchema>;
export type ProductItem = z.infer<typeof ProductItemSchema>;
// export type ProductForm = z.infer<typeof ProductFormSchema>;
// Define ProductForm more broadly to include legacy fields if needed, 
// but for the hook form we mainly care about these.
export interface ProductForm {
    name?: string;
    description?: string;
    category?: string;
    variations: VariationGroup[];
    items: ProductItem[];
    [key: string]: any; // Allow loose typing for other legacy fields
}
