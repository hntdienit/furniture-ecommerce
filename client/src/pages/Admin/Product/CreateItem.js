import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik, Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Box, Grid, Card, CardContent, TextField, Button, Typography, MenuItem } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AdminPageTitle from "../../../components/Admin/AdminPageTitle";
import AdminCardHeader from "../../../components/Admin/AdminCardHeader";
function CreateItem() {
  const [categories, setCategories] = useState([]);
  const [files1, setFiles1] = useState("");
  const [hinh, setHinh] = useState("");
  const [product, setProduct] = useState([]);
  let navigate = useNavigate();
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL_API}/products`).then((response) => {
      if (response.data.error) {
        toast.error(`Data fetch failed - error: ${response.data.error}`, {});
      } else {
        setProduct(response.data);
      }
    });
    axios.get(`${process.env.REACT_APP_URL_API}/categories/getAll`).then((response) => {
      if (response.data.error) {
        toast.error(`Data fetch failed - error: ${response.data.error}`, {});
      } else {
        setCategories(response.data);
      }
    });
  }, []);

  const handleFilesChange = (e) => {
    setFiles1(e.target.files);
  };

  const postForm = async (data) => {
    // console.log(data);

    //   const formData = new FormData();
    //   for (let data in datas) {
    //     formData.append(data, datas[data]);
    //   }
    // console.log(formData);
    // alert(
    //   JSON.stringify(
    //     {
    // originalname: data.file.name,
    // type: data.file.type,
    // size: `${data.file.size} bytes`,
    //     },
    //     null,
    //     2
    //     // data
    //   )
    // );
    // data.image = { originalname: data.image.name, type: data.image.type, size: `${data.image.size} bytes` };

    // let data1 = new FormData();
    // data.profile.forEach((photo, index) => {
    //   data1.append(`photo${index}`, data.profile[index]);
    // });

    // const data1 = new FormData()
    // data1.append("image", )
    await axios
      .post(`${process.env.REACT_APP_URL_API}/products`, data, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.error) {
          toast.error(`Add new product failed! - error: ${response.data.error}`, {});
        } else {
          console.log(response.data.hinh);
          // setHinh(response.data.hinh)
          toast.success("Add new product successfully!", {});
          navigate("/admin");
        }
      });
  };

  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
  const validationSchema = yup.object({
    categoryId: yup
      .string()
      .matches(/[1-9]+/, "Is not in correct format")
      .required("you haven't selected a variation!"),
    name: yup
      .string()
      .min(3, "The product name needs more than 3 characters!")
      .max(15, "The product name needs less than 15 characters!")
      .required("The product name cannot be empty!"),
    description: yup
      .string()
      .min(3, "The product description needs more than 3 characters!")
      .max(30, "The product description needs less than 30 characters!")
      .required("The product description cannot be empty!"),
    color: yup
      .string()
      .min(3, "The product color needs more than 3 characters!")
      .max(30, "The product color needs less than 30 characters!")
      .required("The product color cannot be empty!"),
    size: yup
      .string()
      .min(3, "The product size needs more than 3 characters!")
      .max(30, "The product size needs less than 30 characters!")
      .required("The product size cannot be empty!"),
    stock: yup.number().required("The product stock cannot be empty!"),
    price: yup.number().required("The product price cannot be empty!"),
    // image: yup
    //   .mixed()
    //   .nullable()
    //   .required()
    //   .test("FILE_SIZE", "qua lon", (value) => !value || (value && value.size <= 1024 * 1024))
    //   .test(
    //     "FILE_FORMAT",
    //     "khong dung dang hinh",
    //     (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))
    //   ),
  });

  const formik = useFormik({
    initialValues: {
      categoryId: "",
      name: "",
      description: "",
      color: "",
      size: "",
      stock: "",
      price: "",
      image: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formDataToSend = new FormData();
      formDataToSend.append("name", values.name);
      formDataToSend.append("categoryId", values.categoryId);
      formDataToSend.append("description", values.description);
      formDataToSend.append("color", values.color);
      formDataToSend.append("size", values.size);
      formDataToSend.append("stock", values.stock);
      formDataToSend.append("price", values.price);
      for (let i = 0; i < files1.length; i++) {
        formDataToSend.append("image", files1[i]);
      }
      postForm(formDataToSend);
    },
  });
  return (
    <>
      <AdminPageTitle>Product</AdminPageTitle>
      <Card elevation={4}>
        <AdminCardHeader add title={"Product"} to={"/admin/listproduct"}></AdminCardHeader>
        <CardContent>
          {/* {product.map((item, index) => {
            return (
              <img key={index} src={item.url} />
            )
          })} */}
          <Box
            component={"form"}
            sx={{ flexGrow: 1 }}
            onSubmit={formik.handleSubmit}
            autoComplete="off"
            encType="multipart/form-data"
          >
            <Grid container justifyContent="center" alignItems="center" spacing={2} paddingX={2}>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="name"
                  name="name"
                  label="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  select
                  label="category"
                  id="categoryId"
                  name="categoryId"
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                  error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                  helperText={formik.touched.categoryId && formik.errors.categoryId}
                >
                  {categories.length === 0 ? (
                    <MenuItem value="a">You need to add category first!</MenuItem>
                  ) : (
                    categories.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="description"
                  name="description"
                  label="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <input type="file" name="image" multiple onChange={handleFilesChange} />
                {/* <div className={"mt-1"}>
                <ErrorMessage name="image" component={"span"} />
                </div> */}
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="color"
                  name="color"
                  label="color"
                  value={formik.values.color}
                  onChange={formik.handleChange}
                  error={formik.touched.color && Boolean(formik.errors.color)}
                  helperText={formik.touched.color && formik.errors.color}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="size"
                  name="size"
                  label="size"
                  value={formik.values.size}
                  onChange={formik.handleChange}
                  error={formik.touched.size && Boolean(formik.errors.size)}
                  helperText={formik.touched.size && formik.errors.size}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="stock"
                  name="stock"
                  label="stock"
                  value={formik.values.stock}
                  onChange={formik.handleChange}
                  error={formik.touched.stock && Boolean(formik.errors.stock)}
                  helperText={formik.touched.stock && formik.errors.stock}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="price"
                  name="price"
                  label="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>
            </Grid>
            <Typography component="div" marginTop={2} paddingLeft={2}>
              <Button variant="contained" type="submit" endIcon={<SaveIcon />}>
                Save
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

//   const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
//   const initialValues = {
//     image: null,
//   };

//   const validationSchema = yup.object({
//     image: yup.mixed().nullable().required(),
//     // .test("FILE_SIZE", "qua lon", (value) => !value || (value && value.size <= 1024 * 1024))
//     // .test(
//     //   "FILE_FORMAT",
//     //   "khong dung dang hinh",
//     //   (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))
//     // ),
//   });

//   return (
//     <>
//       <Box component={"div"}>
//         <div className={"container py-5"}>
//           <div className={"row"}>
//             <div className={"col-xxl-6 offset-xxl-3 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2"}>
//               <div>
//                 <div>

//                   <Formik initialValues={initialValues} onSubmit={postForm} validationSchema={validationSchema}>
//                     {({ value, setFieldValue }) => (
//                       <div>
//                         <Form>
//                           <h5>file</h5>
//                           <div>
//                             <input
//                               type="file"
//                               id="image"
//                               name="image"
//                               // accept='image/*'
//                               multiple
//                               // onChange={(e)=>{

//                               //     setFieldValue("image", e.target.files[0]);
//                               //     // const { files } = e.target;

//                               //     // const filesArray = Array.from(files);
//                               //     // let array = [];
//                               //     // for (let i = 0; i < event.currentTarget.files.length; i++) {
//                               //     //   // debugger;
//                               //     //   array.push(event.currentTarget.files[i]);
//                               //     // }
//                               //     // setFieldValue("image", array);

//                               // }}
//                               onChange={handleFilesChange}
//                             />
//                             <div className={"mt-1"}>
//                               <ErrorMessage name="image" component={"span"} />
//                             </div>
//                           </div>

//                           <button type="submit">
//                             <span></span> gui file di
//                           </button>
//                         </Form>
//                       </div>
//                     )}
//                   </Formik>
//                   {/* <Formik
//                     initialValues={{ files: null }}
//                     onSubmit={(values) => {
//                       console.log(values);
//                       postForm(values)
//                     }}
//                   >
//                     {({ setFieldValue, handleSubmit }) => (
//                       <form onSubmit={handleSubmit}>
//                         <input
//                           name="files"
//                           type="file"
//                           multiple
//                           onChange={(event) => {
//                             setFieldValue("files", event.currentTarget.files);
//                           }}
//                         />
//                         <button type="submit">Submit</button>
//                       </form>
//                     )}
//                   </Formik> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Box>
//     </>
//   );
// }
export default CreateItem;
