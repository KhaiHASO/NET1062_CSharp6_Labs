import {
  useFieldArray,
  type UseFormReturn,
} from "react-hook-form";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Label } from "./ui/label";
import type { ProductForm } from "../schema";

interface VariationBuilderProps {
  form: UseFormReturn<ProductForm>;
}

export function VariationBuilder({ form }: VariationBuilderProps) {
  const { control } = form;
  const { fields: groupFields, append: appendGroup, remove: removeGroup, move: moveGroup } = useFieldArray({
    control,
    name: "variations",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id === over.id) return;

    // Check if dragging a Group
    const activeGroupIndex = groupFields.findIndex((g) => g.id === active.id);
    const overGroupIndex = groupFields.findIndex((g) => g.id === over.id);

    if (activeGroupIndex !== -1 && overGroupIndex !== -1) {
      moveGroup(activeGroupIndex, overGroupIndex);
      return;
    }

    // Dragging an Option (Handled inside SortableGroup but logically could be here if we lift state)
    // Actually, distinct DndContexts or checking ID patterns is better.
    // For simplicity in this demo, we assume options reorder is handled by the group's internal logic 
    // or we pass a callback. However, `useFieldArray` provides `move`.
    // We will let the SortableGroup handle its own options reordering if possible, 
    // OR we can implement global logic here if IDs are globally unique.
    
    // Since option IDs are UUIDs, we can find which group they belong to.
    // But `move` only works within one array. Dragging between groups is not required.
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Phân loại hàng</h3>
        <Button
          type="button"
          onClick={() =>
            appendGroup({
              id: uuidv4(),
              name: "",
              options: [{ id: uuidv4(), value: "", displayOrder: 0 }],
            })
          }
          disabled={groupFields.length >= 2}
          variant="outline"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Thêm nhóm phân loại
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={groupFields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {groupFields.map((field, index) => (
              <SortableGroup
                key={field.id}
                field={field}
                index={index}
                form={form}
                removeGroup={() => removeGroup(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

interface SortableGroupProps {
  field: any; // Type hack for FieldArrayWithId
  index: number;
  form: UseFormReturn<ProductForm>;
  removeGroup: () => void;
}

function SortableGroup({ field, index, form, removeGroup }: SortableGroupProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { control, register } = form;
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
    move: moveOption,
  } = useFieldArray({
    control,
    name: `variations.${index}.options` as const,
  });

  // Local DndContext for options to avoid conflict with parent? 
  // No, DndKit prefers single root context usually, but nested contexts work if strict.
  // Better approach: Use global context but handle ID detection. 
  // But to keep it simple and isolated, we can try a nested DndContext with `stopPropagation` on sensors 
  // OR just rely on the parent DndContext knowing about these items.
  // CRITICAL: If we reuse parent context, `groupFields` in parent doesn't know about `optionFields`.
  // So we MUST use a separate DndContext for the inner list OR lift all state.
  // A nested DndContext is the easiest way to isolate 'Inner Sort' from 'Outer Sort'.
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: { distance: 5 } // Prevent accidental drags
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleOptionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = optionFields.findIndex((o) => o.id === active.id);
    const newIndex = optionFields.findIndex((o) => o.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      moveOption(oldIndex, newIndex);
      // Update displayOrder? 
      // Ideally we sync displayOrder with index after move, but for API submission we can map index to displayOrder.
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 gap-4 py-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:text-primary"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label>Tên nhóm phân loại {index + 1}</Label>
            <Input
              {...register(`variations.${index}.name` as const)}
              placeholder="Ví dụ: Màu sắc, Kích thước"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={removeGroup}
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
            <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleOptionDragEnd}
                // Important: Stop propagation to prevent bubbling to parent DndContext
                modifiers={[]}
            >
                <SortableContext items={optionFields.map(o => o.id)} strategy={horizontalListSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {optionFields.map((option, optIndex) => (
                        <SortableOption
                            key={option.id}
                            id={option.id}
                            index={optIndex}
                            groupIndex={index}
                            form={form}
                            remove={() => removeOption(optIndex)}
                        />
                        ))}
                         <Button
                            type="button"
                            variant="outline"
                            className="h-full min-h-[100px] border-dashed"
                            onClick={() => appendOption({ id: uuidv4(), value: "", displayOrder: optionFields.length, image: "" })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Thêm phân loại
                        </Button>
                    </div>
                </SortableContext>
            </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}

interface SortableOptionProps {
  id: string;
  index: number;
  groupIndex: number;
  form: UseFormReturn<ProductForm>;
  remove: () => void;
}

function SortableOption({ id, index, groupIndex, form, remove }: SortableOptionProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    const { register } = form;
    
    // Only allow image upload for the first group (Shopee logic)
    const isFirstGroup = groupIndex === 0; 
    
    return (
        <div ref={setNodeRef} style={style} className="relative border rounded-md p-2 bg-background space-y-2">
            <div className="flex justify-between items-center">
                 <div {...attributes} {...listeners} className="cursor-grab">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                 </div>
                 <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={remove}>
                    <Trash2 className="h-3 w-3" />
                 </Button>
            </div>
            
            <Input 
                {...register(`variations.${groupIndex}.options.${index}.value` as const)} 
                placeholder="Giá trị (VD: Đỏ)"
                className="h-8"
            />
            
            {isFirstGroup && (
                <div className="flex items-center gap-2 mt-2">
                     <div className="w-full h-20 border-dashed border rounded flex items-center justify-center text-muted-foreground text-xs cursor-pointer hover:bg-accent/50 transition">
                        <div className="text-center">
                            <ImageIcon className="h-4 w-4 mx-auto mb-1" />
                            <span>Ảnh</span>
                        </div>
                        {/* Fake file input */}
                        <Input type="hidden" {...register(`variations.${groupIndex}.options.${index}.image` as const)} />
                     </div>
                </div>
            )}
        </div>
    )
}
