import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useFormik } from "formik";
import * as yup from "yup";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SaveIcon from "@mui/icons-material/Save";


function CreateVariation() {
  const [categories, setCategories] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL_API}/categories/getall`).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        setCategories(response.data);
      }
    });
  }, []);

  const postForm = async (data) => {
    await axios
      .post(`${process.env.REACT_APP_URL_API}/variations`, data, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          toast.success("Success Notification !", {});
          navigate("/admin/listcategory");
        }
      });
  };
  const validationSchema = yup.object({
    name: yup
      .string()
      .min(3, "The variation names need more than 3 characters!")
      .max(15, "The variation names need less than 15 characters!")
      .required("The variation name cannot be empty!"),
    categoryId: yup.string().required("you haven't selected a variation!"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      categoryId: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      postForm(values);
    },
  });

  return (
    <>
      <Box component={"div"}>
        <Typography variant="h5" component="div" marginBottom={3} color={"#000"}>
          <Link to={"/admin"}>
            <HomeIcon />
          </Link>{" "}
          | Variation
        </Typography>
      </Box>

      <Card elevation={6}>
        <CardContent>
          <Typography variant="h6" component="div" marginBottom={2} color={"#198754"}>
            <Typography variant="h6" component="span" marginRight={1}>
              <AddCircleOutlineIcon />
            </Typography>
            New variation
          </Typography>
          <Box component={"form"} sx={{ flexGrow: 1 }} onSubmit={formik.handleSubmit} autoComplete="off">
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
                  label="chon loai"
                  id="categoryId"
                  name="categoryId"
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                  error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                  helperText={formik.touched.categoryId && formik.errors.categoryId}
                >
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.id} - {option.name}
                    </MenuItem>
                  ))}
                </TextField>
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

export default CreateVariation;