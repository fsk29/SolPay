import React, { ChangeEvent, FormEvent, useState } from "react";
import styles from "../styles/AddressForm.module.css";

function AddressForm(props: { handler: (address: string) => void }) {
  const [values, setValues] = useState({
    address: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.handler(values.address);
  };

  const handleAddressInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setValues((values) => ({
      ...values,
      address: event.target.value,
    }));
  };

  return (
    <div className={styles.Form}>
      <form onSubmit={handleSubmit}>
        <input
          id="public-key"
          className={styles.formField}
          type="text"
          placeholder="To"
          name="firstName"
          value={values.address}
          onChange={handleAddressInputChange}
        />
        <br />
        <button type="submit" className={styles.formButton}>
          Send
        </button>
      </form>
    </div>
  );
}

export default AddressForm;
