import { useEffect, useState } from "react";
import { type UseFormReturn, useWatch, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import type { ProductForm, ProductItem, VariationGroup, VariationOption } from "../../helpers/schema";
import { Table, Card, CardBody, Input, Button, Label } from "reactstrap";

interface SKUTableProps {
  form: UseFormReturn<ProductForm>;
}

export function SKUTable({ form }: SKUTableProps) {
  const { register, control, setValue, getValues } = form;

  // Use field array for ITEMS ensures we have stable IDs and can perform bulk updates efficiently
  const { fields: itemFields, replace } = useFieldArray({
    control,
    name: "items"
  });

  const variations = useWatch({ control, name: "variations" });

  // Watch group names specifically for headers
  const group1Name = useWatch({ control, name: "variations.0.name" });
  const group2Name = useWatch({ control, name: "variations.1.name" });

  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");

  // --- Logic: Cartesian Product Generation ---
  useEffect(() => {
    // 1. Validate variations existence
    if (!variations || variations.length === 0) return;
    const group1 = variations[0];
    const group2 = variations[1];

    if (!group1 || !group1.options || group1.options.length === 0) {
      // If no options, clear table if it isn't already empty (to avoid loops)
      if (itemFields.length > 0) {
        replace([]);
      }
      return;
    }

    // 2. Generate desired items based on current variations
    const newItems: ProductItem[] = [];

    // Helper to find existing data (price, stock, sku, image) to preserve
    const currentItemsFn = getValues("items") || [];
    const findExisting = (attr1Id: string, attr2Id?: string) => {
      return currentItemsFn.find(
        (i) => i.attribute1Id === attr1Id && i.attribute2Id === attr2Id
      );
    };

    if (group2 && group2.options && group2.options.length > 0) {
        // Two Groups
        group1.options.forEach((opt1: VariationOption) => {
             group2.options.forEach((opt2: VariationOption) => {
                 const existing = findExisting(opt1.id, opt2.id);
                 const generatedSKU = `${opt1.value}-${opt2.value}`.toUpperCase();
                 
                 newItems.push({
                     id: existing?.id || uuidv4(),
                     sku: existing?.sku ? existing.sku : generatedSKU,
                     price: existing?.price || 0,
                     stock: existing?.stock || 0,
                     attribute1: opt1.value,
                     attribute2: opt2.value,
                     attribute1Id: opt1.id,
                     attribute2Id: opt2.id,
                     image: existing?.image || "", 
                 });
             });
        });
    } else {
        // Single Group
        group1.options.forEach((opt1: VariationOption) => {
             const existing = findExisting(opt1.id, undefined);
             const generatedSKU = `${opt1.value}`.toUpperCase();

             newItems.push({
                 id: existing?.id || uuidv4(),
                 sku: existing?.sku ? existing.sku : generatedSKU,
                 price: existing?.price || 0,
                 stock: existing?.stock || 0,
                 attribute1: opt1.value,
                 attribute2: undefined,
                 attribute1Id: opt1.id,
                 attribute2Id: undefined,
                 image: existing?.image || "",
             });
        });
    }

    // 3. Deep Compare logic to prevent infinite loops: 
    // We only replace if the structure of attributes (IDs/Values) has changed.
    // We do NOT replace if only price/stock changed (because that's handled by inputs).
    const isStructureDifferent = 
        newItems.length !== itemFields.length ||
        newItems.some((ni, idx) => {
            const currentItem = itemFields[idx];
            return !currentItem || 
                   ni.attribute1Id !== currentItem.attribute1Id || 
                   ni.attribute2Id !== currentItem.attribute2Id ||
                   ni.attribute1 !== currentItem.attribute1 ||
                   ni.attribute2 !== currentItem.attribute2;
        });

    if (isStructureDifferent) {
         replace(newItems);
    }

  }, [variations, replace, getValues, itemFields]); // Dependencies

  // --- Bulk Apply ---
  const applyBulk = () => {
    const p = parseFloat(bulkPrice);
    const s = parseInt(bulkStock);
    if (isNaN(p) && isNaN(s)) return;

    // We can use 'setValue' for items to trigger a bulk update.
    // Since we are using useFieldArray, replace is the cleanest way to update ALL rows while keeping IDs.
    const currentItems = getValues("items");
    const updatedItems = currentItems.map((item) => ({
        ...item,
        price: !isNaN(p) ? p : item.price,
        stock: !isNaN(s) ? s : item.stock
    }));

    replace(updatedItems);
  };

  // --- Headers ---
  const header1 = group1Name && group1Name.trim() !== "" ? group1Name : "Group 1";
  const header2 = group2Name && group2Name.trim() !== "" ? group2Name : "Group 2";

  if (!variations || !variations[0] || !variations[0].options || variations[0].options.length === 0) {
      return (
        <Card>
            <CardBody className="text-center text-muted">
                Add variations above to generate SKU list.
            </CardBody>
        </Card>
      );
  }

  const group1 = variations[0];
  const group2 = variations[1];
  const hasGroup2 = group2 && group2.options && group2.options.length > 0;

  return (
    <Card>
      <CardBody>
        <div className="d-flex align-items-center justify-content-between mb-3">
             <h5 className="fs-14 mb-0">Variant List</h5>
             <div className="d-flex gap-2">
                 <div className="input-group input-group-sm" style={{ width: '150px' }}>
                    <Input 
                        type="number" 
                        placeholder="Price" 
                        value={bulkPrice} 
                        onChange={e => setBulkPrice(e.target.value)} 
                    />
                 </div>
                 <div className="input-group input-group-sm" style={{ width: '150px' }}>
                    <Input 
                        type="number" 
                        placeholder="Stock" 
                        value={bulkStock} 
                        onChange={e => setBulkStock(e.target.value)} 
                    />
                 </div>
                 <Button size="sm" color="primary" onClick={applyBulk}>Apply to All</Button>
             </div>
        </div>

        <div className="table-responsive">
            <Table className="table-bordered align-middle mb-0">
            <thead className="table-light">
                <tr>
                    <th>{header1}</th>
                    {hasGroup2 && <th>{header2}</th>}
                    <th style={{ width: '140px' }}>Price</th>
                    <th style={{ width: '140px' }}>Stock</th>
                    <th>SKU</th>
                </tr>
            </thead>
            <tbody>
                {itemFields.map((field, index) => {
                    const span = hasGroup2 ? group2.options.length : 1;
                    const showGroup1 = index % span === 0;
                    const group1Index = Math.floor(index / span);
                    const group1Option = group1.options[group1Index];

                    return (
                        <TableRow 
                            key={field.id} 
                            fieldId={field.id}
                            index={index} 
                            form={form} // Pass form, not just register
                            showGroup1={showGroup1} 
                            span={span} 
                            hasGroup2={!!hasGroup2} 
                            group1Option={group1Option}
                            group1Index={group1Index}
                            itemValues={field} // For display text
                        />
                    );
                })}
            </tbody>
            </Table>
        </div>
      </CardBody>
    </Card>
  );
}

// Sub-component for clean Table Row
interface TableRowProps {
    fieldId: string;
    index: number;
    form: UseFormReturn<ProductForm>;
    showGroup1: boolean;
    span: number;
    hasGroup2: boolean;
    group1Option: VariationOption;
    group1Index: number;
    itemValues: ProductItem;
}

const TableRow = ({ 
    index, 
    form, 
    showGroup1, 
    span, 
    hasGroup2, 
    group1Option, 
    group1Index,
    itemValues 
}: TableRowProps) => {
    const { register, setValue } = form;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue(`variations.0.options.${group1Index}.image`, reader.result as string, { shouldDirty: true });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
         setValue(`variations.0.options.${group1Index}.image`, "", { shouldDirty: true });
    };

    // Use safe registration with reactstrap (innerRef)
    const priceReg = register(`items.${index}.price`, { valueAsNumber: true });
    const stockReg = register(`items.${index}.stock`, { valueAsNumber: true });
    const skuReg = register(`items.${index}.sku`);

    return (
        <tr>
            {(!hasGroup2 || showGroup1) && (
                <td rowSpan={span} className="bg-white align-top">
                     <div className="d-flex align-items-center gap-2">
                        {group1Option?.image ? (
                             <div className="position-relative">
                                 <img src={group1Option.image} alt="" className="avatar-xs rounded object-cover" />
                                 <div className="position-absolute top-0 start-100 translate-middle d-flex gap-1" style={{ zIndex: 1 }}>
                                     <Label className="badge rounded-pill bg-light text-dark cursor-pointer shadow-sm border p-0 mb-0 d-flex align-items-center justify-content-center" style={{ width: '18px', height: '18px' }}>
                                        <i className="ri-pencil-fill" style={{ fontSize: '10px' }}></i>
                                        <Input type="file" className="d-none" accept="image/*" onChange={handleImageUpload} />
                                     </Label>
                                     <span onClick={handleRemoveImage} className="badge rounded-pill bg-danger text-white cursor-pointer shadow-sm p-0 d-flex align-items-center justify-content-center" style={{ width: '18px', height: '18px' }}>
                                        <i className="ri-close-fill" style={{ fontSize: '12px' }}></i>
                                     </span>
                                 </div>
                             </div>
                        ) : (
                             <Label className="btn btn-sm btn-soft-primary mb-0 p-1" style={{ fontSize: '10px' }}>
                                <i className="ri-image-add-line fs-14 align-middle"></i>
                                <Input type="file" className="d-none" accept="image/*" onChange={handleImageUpload} />
                             </Label>
                        )}
                        <span className="fw-medium">{itemValues.attribute1}</span>
                    </div>
                </td>
            )}
            
            {hasGroup2 && (
                <td>{itemValues.attribute2}</td>
            )}

            <td>
                <Input 
                    type="number"
                    bsSize="sm"
                    className="text-end"
                    name={priceReg.name}
                    onChange={priceReg.onChange}
                    onBlur={priceReg.onBlur}
                    innerRef={priceReg.ref}
                />
            </td>
            <td>
                <Input 
                    type="number"
                    bsSize="sm"
                    className="text-end"
                    name={stockReg.name}
                    onChange={stockReg.onChange}
                    onBlur={stockReg.onBlur}
                    innerRef={stockReg.ref}
                />
            </td>
            <td>
                <Input 
                    bsSize="sm"
                    name={skuReg.name}
                    onChange={skuReg.onChange}
                    onBlur={skuReg.onBlur}
                    innerRef={skuReg.ref}
                />
            </td>
        </tr>
    );
};