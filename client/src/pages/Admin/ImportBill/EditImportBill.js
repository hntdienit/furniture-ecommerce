import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import SaveIcon from "@mui/icons-material/Save";

import AdminPageTitle from "../../../components/Admin/AdminPageTitle";
import AdminCardHeader from "../../../components/Admin/AdminCardHeader";

function EditWarehouse() {
  const { EditId } = useParams();
  const [warehouse, setWarehouse] = useState({});

  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL_API}/warehouses/${EditId}`).then((response) => {
      if (response.data.error) {
        toast.error(`${response.data.error}`, {});
      } else {
        setWarehouse(response.data);
      }
    });
  }, [EditId]);

  const validationSchema = yup.object({
    name: yup
      .string()
      .min(3, "Warehouse names need more than 3 characters!")
      .max(15, "Warehouse names need less than 15 characters!")
      .required("Warehouse names cannot be empty!"),
    address: yup
      .string()
      .min(3, "Warehouse addresses need more than 3 characters!")
      .max(55, "Warehouse addresses need less than 55 characters!")
      .required("Warehouse addresses cannot be empty!"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: undefined,
      address: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      editForm(values);
    },
  });

  const editForm = async (data) => {
    await axios
      .patch(`${process.env.REACT_APP_URL_API}/warehouses/${EditId}`, data, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          toast.error(`${response.data.error}`, {});
        } else {
          toast.success("Edit warehouse successfully!", {});
          navigate("/admin/listwarehouse");
        }
      });
  };
  if (!!warehouse.name) {
    if (!!!formik.values.name) {
      formik.setFieldValue("name", warehouse.name);
      formik.setFieldValue("address", warehouse.address);
    }
    return (
      <>
      <AdminPageTitle>Warehouse</AdminPageTitle>
      <Card elevation={4}>
        <AdminCardHeader add title={"Warehouse"} to={"/admin/listwarehouse"}></AdminCardHeader>
        <CardContent>
          <Box component={"form"} sx={{ flexGrow: 1 }} onSubmit={formik.handleSubmit} autoComplete="off" paddingTop={1}>
            <Grid container justifyContent="center" alignItems="center" spacing={2} paddingX={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="address"
                  name="address"
                  label="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
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
  } else {
    return <div>loading..............</div>;
  }
}

export default EditWarehouse;
