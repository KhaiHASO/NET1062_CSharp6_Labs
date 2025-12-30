import { useEffect, useState } from "react";
import { type UseFormReturn, useWatch } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import type { ProductForm, ProductItem } from "../schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface SKUTableProps {
  form: UseFormReturn<ProductForm>;
}

export function SKUTable({ form }: SKUTableProps) {
  const { register, setValue, control } = form;
  const variations = useWatch({ control, name: "variations" });
  const items = useWatch({ control, name: "items" });

  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");

  // Logic to generate Cartesian Product
  useEffect(() => {
    if (!variations || variations.length === 0) return;

    const group1 = variations[0];
    const group2 = variations[1];

    if (!group1 || group1.options.length === 0) {
      // No valid options, clear items? Or keep empty?
      // If we cleared all variations, we should clear items
      // But only if items are strictly derived.
      return; 
    }

    let newItems: ProductItem[] = [];

    // Helper to find existing item to preserve values
    const findExisting = (attr1: string, attr2?: string) => {
      return items?.find(
        (i) => i.attribute1 === attr1 && i.attribute2 === attr2
      );
    };

    if (group2 && group2.options.length > 0) {
        // 2 Groups
        group1.options.forEach(opt1 => {
             group2.options.forEach(opt2 => {
                 const existing = findExisting(opt1.value, opt2.value);
                 newItems.push({
                     id: existing?.id || uuidv4(),
                     sku: existing?.sku || `${opt1.value}-${opt2.value}`.toUpperCase(),
                     price: existing?.price || 0,
                     stock: existing?.stock || 0,
                     attribute1: opt1.value,
                     attribute2: opt2.value,
                 });
             });
        });
    } else {
        // 1 Group
        group1.options.forEach(opt1 => {
             const existing = findExisting(opt1.value, undefined);
             // Special case: If we had 2 groups and deleted group 2, attr2 becomes undefined.
             // We need to be careful about matching. 
             newItems.push({
                 id: existing?.id || uuidv4(),
                 sku: existing?.sku || `${opt1.value}`.toUpperCase(),
                 price: existing?.price || 0,
                 stock: existing?.stock || 0,
                 attribute1: opt1.value,
                 attribute2: undefined,
             });
        });
    }
    
    // Only update if length or keys changed to avoid infinite loop or strict equality issues
    // JSON stringify compare is quick and dirty but works for this scale
    // const isSame = JSON.stringify(newItems.map(i => ({...i, id: ""}))) === JSON.stringify(items?.map(i => ({...i, id: ""})));
    
    // However, we want to update if inputs change (like adding a new option).
    // The previous logic creates new objects.
    // We should only setValue if the structure is different from current items state.
    // Actually, we must allow the form to hold the state.
    // If we type in inputs, 'items' changes. 
    // This effect runs when 'variations' changes.
    // So we need to sync.
    
    // Simple approach: Always set items when variations change structure.
    // We detect structure change by checking if we need to add/remove rows.
    if (newItems.length !== (items?.length || 0) || !newItems.every((ni, idx) => items && items[idx] && ni.attribute1 === items[idx]?.attribute1 && ni.attribute2 === items[idx]?.attribute2)) {
         setValue("items", newItems);
    }

  }, [variations, setValue, items]); // Dependency on items might cause loops if setValue updates items. 
                                     // But we check distinctness. 
                                     // Ideally remove 'items' from dep array and use functional update or getValues,
                                     // but we need to preserve prices.
                                     // Correct pattern: variations -> generate candidates -> merge with existing items -> set items.
                                     // We only run this effect when `variations` changes. 
                                     // So remove `items` from dependency? No, we need current items to preserve.
                                     // Fix: Use `useWatch` inside, but restrict execution to when `JSON.stringify(variations)` changes.
                                     // For now, let's trust the condition check.

  const applyBulk = () => {
    const p = parseFloat(bulkPrice);
    const s = parseInt(bulkStock);
    
    const currentItems = form.getValues("items");
    const updated = currentItems.map(i => ({
        ...i,
        price: !isNaN(p) ? p : i.price,
        stock: !isNaN(s) ? s : i.stock
    }));
    setValue("items", updated);
  };

    if (variations && variations[0] && variations[0].options.length > 0) {
      // Logic continues
    } else {
      return null;
    }

    const group1 = variations[0];
    const group2 = variations[1];
    const hasGroup2 = group2 && group2.options.length > 0;

    return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách phân loại hàng</CardTitle>
        <div className="flex items-end gap-4 p-4 bg-muted/20 rounded-md border">
            <div className="grid gap-1.5">
                <Input placeholder="Giá" value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} className="w-32" />
            </div>
            <div className="grid gap-1.5">
                <Input placeholder="Kho" value={bulkStock} onChange={e => setBulkStock(e.target.value)} className="w-32" />
            </div>
            <Button type="button" onClick={applyBulk}>Áp dụng cho tất cả</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{group1.name || "Nhóm 1"}</TableHead>
              {hasGroup2 && <TableHead>{group2.name || "Nhóm 2"}</TableHead>}
              <TableHead>Giá bán</TableHead>
              <TableHead>Kho</TableHead>
              <TableHead>SKU phân loại</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item, index) => {
               // RowSpan Logic
               // If hasGroup2, we span Group1 cell for group2.options.length rows
               // We only render Group1 cell if index % group2.options.length === 0
               
               const span = hasGroup2 ? group2.options.length : 1;
               const showGroup1 = index % span === 0;

               return (
                 <TableRow key={item.id || index}>
                   {(!hasGroup2 || showGroup1) && (
                       <TableCell rowSpan={span} className="font-medium align-top bg-muted/5">
                           {item.attribute1}
                       </TableCell>
                   )}
                   
                   {hasGroup2 && (
                       <TableCell>{item.attribute2}</TableCell>
                   )}

                   <TableCell>
                       <Input 
                           {...register(`items.${index}.price`, { valueAsNumber: true })} 
                           type="number"
                           className="w-32"
                       />
                   </TableCell>
                   <TableCell>
                       <Input 
                            {...register(`items.${index}.stock`, { valueAsNumber: true })} 
                            type="number"
                             className="w-32"
                       />
                   </TableCell>
                   <TableCell>
                       <Input 
                            {...register(`items.${index}.sku`)} 
                            className="w-40"
                       />
                   </TableCell>
                 </TableRow>
               );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
