import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormSchema, type ProductForm as ProductFormType } from "../schema";
import { VariationBuilder } from "./VariationBuilder";
import { SKUTable } from "./SKUTable";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function ProductForm() {
  const form = useForm<ProductFormType>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      variations: [],
      items: [],
    },
    mode: "onChange",
  });

  const onSubmit = (data: ProductFormType) => {
    console.log("Form Submitted:", data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <FormProvider {...form}>
      <div className="container mx-auto py-10 max-w-5xl space-y-8">
        <h1 className="text-3xl font-bold">Quản lý Phân loại Sản phẩm</h1>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Tên sản phẩm</Label>
                <Input 
                    id="name" 
                    {...form.register("name")} 
                    placeholder="Nhập tên sản phẩm" 
                />
                {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Variations Builder */}
          <VariationBuilder form={form} />

          {/* SKU Table */}
          <SKUTable form={form} />

          <Button type="submit" size="lg">Hoàn tất</Button>
        </form>
      </div>
    </FormProvider>
  );
}
