import React, {useCallback, useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {useNavigate, useParams} from "react-router-dom";
import {defaultAddEditNeedFields} from "../../constants/default_fields";
import {Loading} from "../shared";
import {Chip, Button, Container, Paper, Typography, Divider, IconButton, Grid} from "@mui/material";
import SelectField from '../shared/fields/SelectField.js'
import Dropdown from "../shared/fields/MultiSelectField";
import GeneralField from "../shared/fields/GeneralField";
import RadioField from "../shared/fields/RadioField";
import {
  createCharacteristic, fetchCharacteristic,
  fetchCharacteristicFieldTypes, fetchCharacteristics,
  fetchCharacteristicsDataTypes,
  fetchCharacteristicsOptionsFromClass, updateCharacteristic
} from "../../api/characteristicApi";
import LoadingButton from "../shared/LoadingButton";
import {AlertDialog} from "../shared/Dialogs";
import {Add as AddIcon, Delete as DeleteIcon} from "@mui/icons-material";
import {fetchNeedSatisfyers} from "../../api/needSatisfyerApi";
import {fetchNeed} from "../../api/needApi";
import {useSnackbar} from "notistack";


const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 0,
    length: 100
  },
}));


export default function AddEditNeed() {

  const classes = useStyles();
  const navigate = useNavigate();
  const {id, option} = useParams();

  const {enqueueSnackbar} = useSnackbar();


  const [state, setState] = useState({
    success: false,
    submitDialog: false,
    loadingButton: false,
    locked: false
  })

  const [errors, setErrors] = useState(
    {}
  )


  const [form, setForm] = useState({
    ...defaultAddEditNeedFields,
  })

  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const options = {characteristics: {}, };
    Promise.all([
      // fetchAllCodes todo
      fetchCharacteristics().then(characteristics => {
        characteristics.data.map((characteristic)=>{options.characteristics[characteristic.id] = characteristic.name});
      }),
      // fetchNeedSatisfyers().then(needSatisfyers => options.needSatisfyers = needSatisfyers)

      // fetchCharacteristicsOptionsFromClass().then(optionsFromClass => newTypes.optionsFromClass = optionsFromClass)
    ]).then(() => {
      if (option === 'edit' && id) {
        return fetchNeed(id).then(res => {
          const data = res.fetchData
          setForm(data)
        })
      }
    }).then(() => {
      setOptions(options);
      setLoading(false);
    }).catch(e => {
      if (e.json)
        setErrors(e.json);
      setLoading(false);
      enqueueSnackbar(`Fail: ` + e.message, {variant: 'error'});
    });
  }, [])

  const handleSubmit = () => {
    if (validate()) {
      setState(state => ({...state, submitDialog: true}))
    }
  }

  const handleConfirm = async () => {
    setState(state => ({...state, loadingButton: true}))
    const readyForm = {...form, classOrManually: undefined}
    if (!isSelected()) {
      readyForm.options = undefined
      readyForm.optionsFromClass = undefined
    } else if (form.classOrManually === 'class') {
      readyForm.options = undefined
    } else if (form.classOrManually === 'manually') {
      readyForm.optionsFromClass = undefined
    }
    if (form.fieldType === 'MultiSelectField') {
      readyForm.multipleValues = true
    } else {
      readyForm.multipleValues = false
    }
    console.log(readyForm)
    if (option === 'add') {
      createCharacteristic(readyForm).then(res => {
        if (res.success) {
          setState(state => ({...state, loadingButton: false, submitDialog: false, successDialog: true}))
        }
      }).catch(e => {
        if (e.json) {
          setErrors(e.json)
        }
        setState(state => ({...state, loadingButton: false, submitDialog: false, failDialog: true}))
      })
    } else if (option === 'edit') {
      updateCharacteristic(id, readyForm).then(res => {
        if (res.success) {
          setState(state => ({...state, loadingButton: false, submitDialog: false, successDialog: true}))
        }
      }).catch(e => {
        if (e.json) {
          setErrors(e.json)
        }
        setState(state => ({...state, loadingButton: false, submitDialog: false, failDialog: true}))
      })
    }
  }


  const validate = () => {
    const errors = {};
    for (const [label, value] of Object.entries(form)) {
      if (label === 'label' || label === 'description' || label === 'fieldType' || label === 'classOrManually' || label === 'name') {
        if (value === '') {
          errors[label] = 'This field cannot be empty'
        }
      } else if (label === 'codes' && value.length === 0) {
        // errors[label] = 'This field cannot be empty'
      } else if (isSelected() && label === 'optionsFromClass' && form.classOrManually === 'class' && value === '') {
        errors[label] = 'This field cannot be empty'
      } else if (isSelected() && label === 'options' && form.classOrManually === 'manually') {
        for (let i = 0; i < form.options.length; i++) {
          if (!form.options[i].label) {
            if (!errors[label]) {
              errors[label] = {}
            }
            errors[label][form.options[i].key] = 'This field cannot be empty, please fill in or remove this field'
          }
        }
      }
    }
    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  if (loading)
    return <Loading/>

  return (


    <Container maxWidth='md'>
      <Paper sx={{p: 2}} variant={'outlined'}>
        <Typography variant={'h4'}> Need </Typography>
        <GeneralField
          key={'type'}
          label={'Type'}
          value={form.type}
          required
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.type = e.target.value}
          error={!!errors.type}
          helperText={errors.type}
        />
        <GeneralField
          key={'changeType'}
          label={'Change Type'}
          value={form.changeType}
          required
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.changeType = e.target.value}
          // onBlur={() => handleOnBlur(field, option)}
          error={!!errors.changeType}
          helperText={errors.changeType}
        />
        <SelectField
          key={'characteristic'}
          options={options.characteristics}
          label={'Characteristic'}
          value={form.characteristic}
          onChange={e => form.characteristic = e.target.value}
          error={!!errors.characteristic}
          helperText={errors.characteristic}
        />

        <Dropdown
          key={'needSatisfyer'}
          options={[]}
          label={'Need Satisfyer'}
          value={form.needSatisfyer}
          onChange={e => form.needSatisfyer = e.target.value}
          error={!!errors.needSatisfyer}
          helperText={errors.needSatisfyer}
        />

        <Dropdown
          key={'codes'}
          options={[]}
          label={'Codes'}
          value={form.codes}
          onChange={e => form.codes = e.target.value}
          error={!!errors.codes}
          helperText={errors.codes}
        />

        <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
          submit
        </Button>
      </Paper>

    </Container>

  )


}