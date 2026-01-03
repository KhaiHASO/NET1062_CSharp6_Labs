import React, { useState } from "react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Card, CardBody, CardHeader, Button, Input, Label } from "reactstrap";
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
import type { ProductForm } from "../../helpers/schema";

interface VariationBuilderProps {
  form: UseFormReturn<ProductForm>;
}

export function VariationBuilder({ form }: VariationBuilderProps) {
  const { control } = form;
  const {
    fields: groupFields,
    append: appendGroup,
    remove: removeGroup,
    move: moveGroup,
  } = useFieldArray({
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
    if (!over || active.id === over.id) return;

    const activeIndex = groupFields.findIndex((g) => g.id === active.id);
    const overIndex = groupFields.findIndex((g) => g.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      moveGroup(activeIndex, overIndex);
    }
  };

  const handleAddGroup = () => {
      if (groupFields.length < 2) {
          appendGroup({
              id: uuidv4(),
              name: "",
              options: [],
          });
      }
  };

  return (
    <div className="mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="card-title mb-0">Variations Config</h5>
        <Button
            color="primary"
            size="sm"
            onClick={handleAddGroup}
            disabled={groupFields.length >= 2}
        >
            <i className="ri-add-line align-middle me-1"></i> Add Variation Group
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
          <div className="d-flex flex-column gap-3">
            {groupFields.map((field, index) => (
              <VariationGroupItem
                key={field.id}
                fieldId={field.id}
                index={index}
                form={form}
                remove={() => removeGroup(index)}
                isFirst={index === 0}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

interface VariationGroupItemProps {
  fieldId: string;
  index: number;
  form: UseFormReturn<ProductForm>;
  remove: () => void;
  isFirst: boolean;
}

function VariationGroupItem({ fieldId, index, form, remove, isFirst }: VariationGroupItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: fieldId });
  const style = { transform: CSS.Transform.toString(transform), transition };

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

  const [inputValue, setInputValue] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleOptionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = optionFields.findIndex((o) => o.id === active.id);
    const overIndex = optionFields.findIndex((o) => o.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      moveOption(activeIndex, overIndex);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = inputValue.trim();
      if (val) {
          const exists = optionFields.some((opt) => opt.value === val);
          if (!exists) {
              appendOption({
                  id: uuidv4(),
                  value: val,
                  displayOrder: optionFields.length,
                  image: "",
              });
          }
          setInputValue("");
      }
    }
  };

  // Safe registration for reactstrap Input which might need innerRef or ref
  const nameReg = register(`variations.${index}.name` as const);

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="border shadow-none mb-0">
        <CardHeader className="bg-light d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2 w-100">
             <span {...attributes} {...listeners} className="cursor-grab text-muted" style={{ touchAction: 'none' }}>
                <i className="ri-drag-move-2-line fs-18"></i>
             </span>
             <span className="fw-bold text-nowrap">Group {index + 1}</span>
             <Input 
                placeholder={isFirst ? "e.g. Color" : "e.g. Size"}
                className="form-control-sm"
                style={{ maxWidth: '200px' }}
                // Spread registration correctly
                name={nameReg.name}
                onChange={nameReg.onChange}
                onBlur={nameReg.onBlur}
                innerRef={nameReg.ref} // Reactstrap specific
             />
          </div>
           <Button color="link" className="text-danger p-0 ms-2" onClick={remove}>
              <i className="ri-delete-bin-line fs-18"></i>
           </Button>
        </CardHeader>
        <CardBody>
            <Label className="form-label-sm text-muted">Options (Type → Enter. Drag to reorder)</Label>
            
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleOptionDragEnd}>
              <SortableContext items={optionFields.map((o) => o.id)} strategy={horizontalListSortingStrategy}>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                      {optionFields.map((opt, optIndex) => (
                          <SortableOption 
                              key={opt.id} 
                              id={opt.id} 
                              value={opt.value} 
                              remove={() => removeOption(optIndex)} 
                          />
                      ))}
                  </div>
              </SortableContext>
            </DndContext>

            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type option and press Enter..."
              bsSize="sm"
            />
        </CardBody>
      </Card>
    </div>
  );
}

function SortableOption({ id, value, remove }: { id: string, value: string, remove: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} className="badge bg-light text-dark border d-flex align-items-center gap-1 p-2">
            <span {...attributes} {...listeners} className="cursor-grab text-muted me-1" style={{ fontSize: '12px' }}>⋮⋮</span>
            {value}
            <span 
              className="cursor-pointer text-muted hover-text-danger ms-1" 
              onClick={remove}
              style={{ fontSize: '14px', lineHeight: '10px' }}
            >×</span>
        </div>
    );
}
