import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {defaultUserFields} from "../../constants/default_fields";
import {Button, Container, TextField, Typography} from "@mui/material";
import {updatePasswordFields} from "../../constants/updatePasswordFields";


const useStyles = makeStyles(() => ({
    root: {
        width: '80%'
    },
    button: {
        marginTop: 12,
        marginBottom: 12,
    }
}));


export default function UserResetPassword() {
    const classes = useStyles();
    const [state, setState] = useState({
        form: {
            ...defaultUserFields
        },
        errors: {},
        //loading: true,
    });


    const validate = () => {
        // const errors = {};
        // for (const [field, option] of Object.entries(updatePasswordFields)) {
        //     if (field ==='12345' ) {
        //         errors[field] = 'Not Match!';
        //         setState(state => ({...state, errors}));
        //         return false
        //     }}
        return true;
    };

    const handleSubmit = () => {
        console.log(state.form)
        if (validate()) {
            setState(state => ({...state, dialog: true}))
            this.props.history.push('/users/new-password')
        }
    }



    return (
        <Container className={classes.root}>
            <Typography variant="h5">
                {'Please enter your old password below:'}
            </Typography>


            {Object.entries(updatePasswordFields).map(([field, option]) => {
                return (
                    <option.component
                        key={field}
                        //label={option.label}
                        type={option.type}
                        options={option.options}
                        value={state.form[field]}
                        required={option.required}
                        onChange={e => state.form[field] = e.target.value}
                        error={!!state.errors[field]}
                        helperText={state.errors[field]}
                    />
                )
            })}

            <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
                Submit
            </Button>
        </Container>
    )
}