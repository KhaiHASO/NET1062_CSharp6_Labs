import React, { useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Input,
  Label,
  FormFeedback,
  Form,
} from "reactstrap";

// Redux
import { useDispatch } from "react-redux";
import { addNewProduct as onAddNewProduct } from "../../../slices/thunks";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import classnames from "classnames";
import Dropzone from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";

// React Hook Form
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormSchema, type ProductForm } from "../../../helpers/schema";
import { VariationBuilder } from "../../../Components/ProductVariant/VariationBuilder";
import { SKUTable } from "../../../Components/ProductVariant/SKUTable";

// Import React FilePond
import { registerPlugin } from "react-filepond";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EcommerceAddProduct = () => {
  document.title = "Create Product | Velzon - React Admin & Dashboard Template";

  const history = useNavigate();
  const dispatch: any = useDispatch();

  const [customActiveTab, setcustomActiveTab] = useState<any>("1");
  const toggleCustom = (tab: any) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const [selectedFiles, setselectedFiles] = useState<any>([]);
  
  // RHF Setup
  const form = useForm<ProductForm>({
      resolver: zodResolver(ProductFormSchema),
      defaultValues: {
          name: "",
          price: 0,
          stock: 0,
          orders: 0,
          category: "",
          publishedDate: new Date().toISOString(),
          status: "published",
          rating: 4.5,
          manufacturer_name: "",
          manufacturer_brand: "",
          product_discount: 0,
          product_tags: "",
          image: "",
          variations: [],
          items: [],
          description: "",
      },
      mode: "onChange"
  });

  const { register, control, handleSubmit, formState: { errors }, setValue } = form;

  function handleAcceptedFiles(files: any) {
    files.map((file: any) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  /**
   * Formats the size
   */
  function formatBytes(bytes: any, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const productCategory = [
    {
      options: [
        { label: "All", value: "All" },
        { label: "Appliances", value: "Kitchen Storage & Containers" },
        { label: "Fashion", value: "Clothes" },
        { label: "Electronics", value: "Electronics" },
        { label: "Grocery", value: "Grocery" },
        { label: "Home & Furniture", value: "Furniture" },
        { label: "Kids", value: "Kids" },
        { label: "Mobiles", value: "Mobiles" },
      ],
    },
  ];

  const productStatus = [
    {
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Scheduled", value: "scheduled" },
      ],
    },
  ];

  const productVisibility = [
    {
      options: [
        { label: "Hidden", value: "Hidden" },
        { label: "Public", value: "Public" },
      ],
    },
  ];

  // image
  const [selectedImage, setSelectedImage] = useState<any>();

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      setValue("image", e.target.result);
      setSelectedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (values: ProductForm) => {
      const newProduct = {
        id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
        name: values.name,
        price: values.price,
        stock: values.stock,
        orders: values.orders,
        category: values.category,
        publishedDate: values.publishedDate,
        status: values.status,
        rating: 4.5,
        image: selectedImage,
        variations: values.variations,
        items: values.items
      };
      // save new product
      dispatch(onAddNewProduct(newProduct));
      history("/apps-ecommerce-products");
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Create Product" pageTitle="Ecommerce" />

        <Form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit)();
                return false;
            }}
        >
        <Row>
          <Col lg={8}>
              <Card>
                <CardBody>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="product-title-input">
                      Product Title
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="product-title-input"
                      placeholder="Enter product title"
                      {...register("name")}
                      invalid={!!errors.name}
                    />
                    {errors.name && (
                      <FormFeedback type="invalid">
                        {errors.name?.message as string}
                      </FormFeedback>
                    )}
                  </div>
                  <div>
                    <Label>Product Description</Label>

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }: { field: any }) => (
                            <CKEditor
                                editor={ClassicEditor as any}
                                data={field.value || ""}
                                onChange={(event: any, editor: any) => {
                                    const data = editor.getData();
                                    field.onChange(data);
                                }}
                            />
                        )}
                    />
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Product Gallery</h5>
                </CardHeader>
                <CardBody>
                  <div className="mb-4">
                    <h5 className="fs-14 mb-1">Product Image</h5>
                    <p className="text-muted">Add Product main Image.</p>
                    <div className="text-center">
                      <div className="position-relative d-inline-block">
                        <div className="position-absolute top-100 start-100 translate-middle">
                          <Label
                            htmlFor="customer-image-input"
                            className="mb-0"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Select Image"
                          >
                            <div className="avatar-xs cursor-pointer">
                              <div className="avatar-title bg-light border rounded-circle text-muted">
                                <i className="ri-image-fill"></i>
                              </div>
                            </div>
                          </Label>
                          <Input
                            className="form-control d-none"
                            id="customer-image-input"
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
                            onChange={handleImageChange}
                            invalid={!!errors.image}
                          />
                        </div>
                        <div className="avatar-lg">
                          <div className="avatar-title bg-light rounded">
                            <img
                              src={selectedImage}
                              id="product-img"
                              alt=""
                              className="avatar-md h-auto"
                            />
                          </div>
                        </div>
                      </div>
                      {errors.image && (
                        <FormFeedback type="invalid" className="d-block">
                          {" "}
                          {errors.image?.message as string}{" "}
                        </FormFeedback>
                      )}
                    </div>
                  </div>
                  <div>
                    <h5 className="fs-14 mb-1">Product Gallery</h5>
                    <p className="text-muted">Add Product Gallery Images.</p>

                    <Dropzone
                      onDrop={(acceptedFiles: any) => {
                        handleAcceptedFiles(acceptedFiles);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone dz-clickable">
                          <div
                            className="dz-message needsclick"
                            {...getRootProps()}
                          >
                            <div className="mb-3 mt-5">
                              <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                            </div>
                            <h5>Drop files here or click to upload.</h5>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                    <div className="list-unstyled mb-0" id="file-previews">
                      {selectedFiles.map((f: any, i: any) => {
                        return (
                          <Card
                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                            key={i + "-file"}
                          >
                            <div className="p-2">
                              <Row className="align-items-center">
                                <Col className="col-auto">
                                  <img
                                    data-dz-thumbnail=""
                                    height="80"
                                    className="avatar-sm rounded bg-light"
                                    alt={f.name}
                                    src={f.preview}
                                  />
                                </Col>
                                <Col>
                                  <Link
                                    to="#"
                                    className="text-muted font-weight-bold"
                                  >
                                    {f.name}
                                  </Link>
                                  <p className="mb-0">
                                    <strong>{f.formattedSize}</strong>
                                  </p>
                                </Col>
                              </Row>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Variation Builder Section */}
              <VariationBuilder form={form} />
              
              <div className="mt-4">
                  <SKUTable form={form} />
              </div>


              <Card>
                <CardHeader>
                  <Nav className="nav-tabs-custom card-header-tabs border-bottom-0">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "1",
                        })}
                        onClick={() => {
                          toggleCustom("1");
                        }}
                      >
                        General Info
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>

                <CardBody>
                  <TabContent activeTab={customActiveTab}>
                    <TabPane id="addproduct-general-info" tabId="1">
                      <Row>
                        <Col lg={6}>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="manufacturer-name-input"
                            >
                              Manufacturer Name
                            </label>
                            <Input
                              type="text"
                              className="form-control"
                              id="manufacturer-name-input"
                              placeholder="Enter manufacturer name"
                              {...register("manufacturer_name")}
                              invalid={!!errors.manufacturer_name}
                            />
                             {errors.manufacturer_name && (
                              <FormFeedback type="invalid">
                                {errors.manufacturer_name?.message as string}
                              </FormFeedback>
                            )}
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="manufacturer-brand-input"
                            >
                              Manufacturer Brand
                            </label>
                            <Input
                              type="text"
                              className="form-control"
                              id="manufacturer-brand-input"
                              placeholder="Enter manufacturer brand"
                              {...register("manufacturer_brand")}
                              invalid={!!errors.manufacturer_brand}
                            />
                            {errors.manufacturer_brand && (
                              <FormFeedback type="invalid">
                                {errors.manufacturer_brand?.message as string}
                              </FormFeedback>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={3}>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="product-stock-input"
                            >
                              Stocks
                            </label>
                            <div className="input-group mb-3">
                              <Input
                                type="number"
                                className="form-control"
                                id="product-stock-input"
                                placeholder="Enter Stocks"
                                {...register("stock", { valueAsNumber: true })}
                                invalid={!!errors.stock}
                              />
                               {errors.stock && (
                                <FormFeedback type="invalid">
                                  {errors.stock?.message as string}
                                </FormFeedback>
                              )}
                            </div>
                          </div>
                        </Col>

                        <Col sm={3}>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="product-price-input"
                            >
                              Price
                            </label>
                            <div className="input-group mb-3">
                              <span
                                className="input-group-text"
                                id="product-price-addon"
                              >
                                $
                              </span>
                              <Input
                                type="number"
                                className="form-control"
                                id="product-price-input"
                                placeholder="Enter price"
                                {...register("price", { valueAsNumber: true })}
                                invalid={!!errors.price}
                              />
                               {errors.price && (
                                <FormFeedback type="invalid">
                                  {errors.price?.message as string}
                                </FormFeedback>
                              )}
                            </div>
                          </div>
                        </Col>

                        <Col sm={3}>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="product-Discount-input"
                            >
                              Discount
                            </label>
                            <div className="input-group mb-3">
                              <span
                                className="input-group-text"
                                id="product-Discount-addon"
                              >
                                %
                              </span>
                              <Input
                                type="number"
                                className="form-control"
                                id="product-Discount-input"
                                placeholder="Enter Discount"
                                {...register("product_discount", { valueAsNumber: true })}
                                invalid={!!errors.product_discount}
                              />
                               {errors.product_discount && (
                                <FormFeedback type="invalid">
                                  {errors.product_discount?.message as string}
                                </FormFeedback>
                              )}
                            </div>
                          </div>
                        </Col>

                        <Col sm={3}>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="product-orders-input"
                            >
                              Orders
                            </label>
                            <div className="input-group mb-3">
                              <Input
                                type="number"
                                className="form-control"
                                id="product-orders-input"
                                placeholder="Enter orders"
                                {...register("orders", { valueAsNumber: true })}
                                invalid={!!errors.orders}
                              />
                               {errors.orders && (
                                <FormFeedback type="invalid">
                                  {errors.orders?.message as string}
                                </FormFeedback>
                              )}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>

              <div className="text-end mb-3">
                <button type="submit" className="btn btn-success w-sm">
                  Submit
                </button>
              </div>
          </Col>

          <Col lg={4}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Publish</h5>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <Label
                    htmlFor="choices-publish-status-input"
                    className="form-label"
                  >
                    Status
                  </Label>
                  <Input
                    type="select"
                    className="form-select"
                    id="choices-publish-status-input"
                    {...register("status")}
                    invalid={!!errors.status}
                  >
                    {productStatus.map((item, key) => (
                      <React.Fragment key={key}>
                        {item.options.map((item, key) => (
                          <option value={item.value} key={key}>
                            {item.label}
                          </option>
                        ))}
                      </React.Fragment>
                    ))}
                  </Input>
                    {errors.status && (
                    <FormFeedback type="invalid">
                      {errors.status?.message as string}
                    </FormFeedback>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="choices-publish-visibility-input"
                    className="form-label"
                  >
                    Visibility
                  </Label>

                  <Controller 
                    name="visibility"
                    control={control}
                    render={({ field }: { field: any }) => (
                         <Select
                            {...field}
                            options={productVisibility[0].options}
                            classNamePrefix="select2-selection form-select"
                         />
                    )}
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Publish Schedule</h5>
              </CardHeader>

              <CardBody>
                <div>
                  <label
                    htmlFor="datepicker-publish-input"
                    className="form-label"
                  >
                    Publish Date & Time
                  </label>
                  <Controller
                    control={control}
                    name="publishedDate"
                    render={({ field: { onChange, value } }: { field: { onChange: any; value: any } }) => (
                        <Flatpickr
                        className="form-control"
                        value={value}
                        onChange={([date]: any) => {
                            onChange(date.toISOString());
                        }}
                        options={{
                            enableTime: true,
                            altInput: true,
                            altFormat: "d M, Y, G:i K",
                            dateFormat: "d M, Y, G:i K",
                        }}
                        />
                    )}
                   />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Product Categories</h5>
              </CardHeader>
              <CardBody>
                <p className="text-muted mb-2">
                  {" "}
                  <Link to="#" className="float-end text-decoration-underline">
                    Add New
                  </Link>
                  Select product category
                </p>

                <Input
                  type="select"
                  className="form-select"
                  id="category-field"
                  {...register("category")}
                  invalid={!!errors.category}
                >
                  {productCategory.map((item, key) => (
                    <React.Fragment key={key}>
                      {item.options.map((item, key) => (
                        <option value={item.value} key={key}>
                          {item.label}
                        </option>
                      ))}
                    </React.Fragment>
                  ))}
                </Input>
                 {errors.category && (
                  <FormFeedback type="invalid">
                    {errors.category?.message as string}
                  </FormFeedback>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Product Tags</h5>
              </CardHeader>
              <CardBody>
                <div className="hstack gap-3 align-items-start">
                  <div className="flex-grow-1">
                    <Input
                      className="form-control"
                      placeholder="Enter tags"
                      type="text"
                      {...register("product_tags")}
                      invalid={!!errors.product_tags}
                    />
                     {errors.product_tags && (
                      <FormFeedback type="invalid">
                        {errors.product_tags?.message as string}
                      </FormFeedback>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Product Short Description</h5>
              </CardHeader>
              <CardBody>
                <p className="text-muted mb-2">
                  Add short description for product
                </p>
                <textarea
                  className="form-control"
                  placeholder="Must enter minimum of a 100 characters"
                  rows={3}
                ></textarea>
              </CardBody>
            </Card>
          </Col>
        </Row>
        </Form>
      </Container>
    </div>
  );
};

export default EcommerceAddProduct;
