import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function AddressForm() {
  const [inputs, setInputs] = useState({});
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <React.Fragment>
      <form id="address-form">
        <Typography variant="h6" gutterBottom>
          Shipping address
        </Typography>
        <Grid container spacing={3}>
          <Grid
            // onSubmit={handleSubmit(onSubmit)}
            component="form"
            item
            xs={12}
            sm={6}
          >
            <TextField
              error={Boolean(errors.name)}
              helperText={
                Boolean(errors.name)
                  ? "This field is required & min 3 character"
                  : null
              }
              {...register("firstName", { required: true, minLength: 3 })}
              onChange={handleChange}
              id="firstName"
              label="First name"
              fullWidth
              autoComplete="given-name"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="lastName"
              name="lastName"
              label="Last name"
              fullWidth
              autoComplete="family-name"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={Boolean(errors.address1)}
              helperText={
                Boolean(errors.address1)
                  ? "This field is required & min 3 character"
                  : null
              }
              {...register("address1", { required: true, minLength: 3 })}
              onChange={handleChange}
              id="address1"
              label="Address line 1"
              fullWidth
              autoComplete="shipping address-line1"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="address2"
              name="address2"
              label="Address line 2"
              fullWidth
              autoComplete="shipping address-line2"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              error={Boolean(errors.city)}
              helperText={
                Boolean(errors.city)
                  ? "This field is required & min 3 character"
                  : null
              }
              {...register("city", { required: true, minLength: 3 })}
              onChange={handleChange}
              id="city"
              label="City"
              fullWidth
              autoComplete="shipping address-level2"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="state"
              name="state"
              label="State/Province/Region"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="zip"
              name="zip"
              label="Zip / Postal code"
              fullWidth
              autoComplete="shipping postal-code"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              error={Boolean(errors.country)}
              helperText={
                Boolean(errors.country)
                  ? "This field is required & min 3 character"
                  : null
              }
              {...register("country", { required: true, minLength: 3 })}
              onChange={handleChange}
              id="country"
              label="Country"
              fullWidth
              autoComplete="shipping country"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox color="secondary" name="saveAddress" value="yes" />
              }
              label="Use this address for payment details"
            />
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
}
