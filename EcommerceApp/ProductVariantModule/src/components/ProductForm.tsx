import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormSchema, type ProductForm as ProductFormType } from "../schema";
import { VariationBuilder } from "./VariationBuilder";
import { SKUTable } from "./SKUTable";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useCreateProductMutation } from "../services/product";
import { Loader2 } from "lucide-react";

export default function ProductForm() {
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const form = useForm<ProductFormType>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      variations: [],
      items: [],
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ProductFormType) => {
    try {
        await createProduct(data).unwrap();
        alert("Thêm sản phẩm thành công!");
        form.reset();
    } catch (error) {
        console.error("Failed to create product:", error);
        alert("Có lỗi xảy ra khi thêm sản phẩm.");
    }
  };

  return (
    <FormProvider {...form}>
      <div className="container mx-auto py-10 max-w-5xl space-y-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Quản lý Phân loại Sản phẩm</h1>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gray-50/50 border-b pb-4">
              <CardTitle className="text-xl text-gray-800">Thông tin cơ bản</CardTitle>
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

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 transition-all">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Đang xử lý..." : "Hoàn tất"}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
