/**
 * For how the drag and drop works, please check the library repository:
 * https://github.com/atlassian/react-beautiful-dnd
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from "react-router";
import { allForms } from '../../constants/provider_fields.js'
import { Button, Container, Grid, TextField, Typography, Divider, IconButton, Box, Paper } from "@mui/material";
import SelectField from "../shared/fields/SelectField";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Close as Delete } from "@mui/icons-material";
import { Loading } from "../shared";
import AddFormDialog from "./components/AddFormDialog";
import StepFields from "./components/StepFields";
import { createDynamicForm, getDynamicFormsByFormType, updateDynamicForm } from "../../api/dynamicFormApi";
import { fetchCharacteristics } from "../../api/characteristicApi";
import { Picker } from "./components/Pickers";
import { fetchQuestions } from "../../api/questionApi";


export default function ManageFormFields() {
  const history = useHistory();

  // Page path: /settings/forms/:formType/:method/:formId
  const {formType, method, formId} = useParams();
  console.log(formType, method, formId)

  const [loading, setLoading] = useState(true);

  const [availableForms, setAvailableForms] = useState([]);

  // Characteristic Related
  const [characteristics, setCharacteristics] = useState({});
  const [characteristicOptions, setCharacteristicOptions] = useState({});
  const [selectedCharacteristicId, setSelectedCharacteristicId] = useState('');
  const [usedCharacteristicIds, setUsedCharacteristicIds] = useState([]);

  // Questions Related
  const [questions, setQuestions] = useState({});
  const [questionOptions, setQuestionOptions] = useState({});
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);

  const [openAddFormDialog, setOpenAddFormDialog] = useState(false);
  const [state, setState] = useState({
    stepToAdd: '',
    selectedStep: '',
  });
  // {name: 'form name', formType: 'client', formStructure: [
  //    {stepName: 'step 1', fields: [
  //       {id: 1, type: 'characteristic', required: true, implementation: {...}}
  //    ]},
  //    {...}
  // ]}
  // inferred state

  const [form, setForm] = useState({formStructure: []});
  console.log('form,', form)

  useEffect(() => {
    const tasks = [
      // Fetch forms
      getDynamicFormsByFormType(formType).then(({forms}) => setAvailableForms(forms)),

      // Fetch characteristics
      fetchCharacteristics().then(({data}) => {
        const dict = {};
        const options = {};
        for (const characteristic of data) {
          dict[characteristic.id] = characteristic;
          options[characteristic.id] = `${characteristic.name} (${characteristic.implementation.label})`
        }
        setCharacteristics(dict);
        setCharacteristicOptions(options);
      }),

      // Fetch questions
      fetchQuestions().then(({data}) => {
        const dict = {};
        const options = {};
        for (const question of data) {
          dict[question.id] = question;
          options[question.id] = `${question.content} (${question.description || ''})`
        }
        setQuestions(dict);
        setQuestionOptions(options);
      })
    ];

    Promise.all(tasks).then(() => {
      console.log('done')
      setLoading(false);
    });

  }, [formType]);

  const submit = async () => {
    console.log(form);

    try {
      if (method === 'new') {
        await createDynamicForm(form);

      } else {
        await updateDynamicForm(formId, form);
      }
      history.push('/dashboard');
    } catch (e) {
      console.error(e)
    }
  };

  const handleChange = useCallback(name => e => {
    const value = e.target.value;
    setState(state => ({...state, [name]: value}));
  }, [state.fields]);

  const handleDeleteField = useCallback((stepIndex, fieldIndex) => {
    setForm(form => {
      const step = form.formStructure[stepIndex];
      const [removed] = step.fields.splice(fieldIndex, 1);

      if (removed.type === 'characteristic') {
        setUsedCharacteristicIds(used => {
          const idx = used.findIndex(chara => chara.id === removed.id);
          used.splice(idx, 1);
          return [...used];
        })
      } else if (removed.type === 'question') {
        //...
      }

      return {...form};
    });
  }, []);

  const handleAddCharacteristic = useCallback(() => {
    setForm(form => {
      const formStructure = form.formStructure.find(structure => state.selectedStep === structure.stepName);
      formStructure.fields = [...formStructure.fields, {type: 'characteristic', ...characteristics[selectedCharacteristicId]}]
      return {...form};
    });
    setUsedCharacteristicIds(used => [...used, selectedCharacteristicId])

  }, [selectedCharacteristicId, characteristics, state.selectedStep]);

  const handleAddQuestion = useCallback(() => {
    setForm(form => {
      const formStructure = form.formStructure.find(structure => state.selectedStep === structure.stepName);
      formStructure.fields = [...formStructure.fields, {type: 'question', ...questions[selectedQuestionId]}]
      return {...form};
    });
    setUsedQuestionIds(used => [...used, selectedCharacteristicId])

  }, [selectedQuestionId, questions, state.selectedStep]);

  const handleRemoveStep = useCallback((index, stepName) => () => {
    setForm(form => {
      form.formStructure.splice(index, 1)
      return {...form, formStructure: [...form.formStructure]};
    })
  }, []);

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const [removed] = list.splice(startIndex, 1);
    list.splice(endIndex, 0, removed);
  };

  // invoked when something is dropped
  const onDragEnd = ({source, destination}) => {

    // dropped outside the list
    if (!destination) {
      return;
    }
    const targetStepIdx = destination.droppableId;
    const sourceStepIdx = source.droppableId;

    // moved to other steps
    if (source.droppableId !== destination.droppableId) {
      const sourceFields = form.formStructure[sourceStepIdx].fields;
      const targetFields = form.formStructure[targetStepIdx].fields;
      const [removed] = sourceFields.splice(source.index, 1);
      targetFields.splice(destination.index, 0, removed);
    }
    // moved within a step
    else {
      reorder(
        form.formStructure[targetStepIdx].fields,
        source.index,
        destination.index
      );
    }
  };

  const newStepComponent = useMemo(() => {
    if (!formType) return null;
    return (
      <Grid container alignItems="flex-end" spacing={2} sx={{pb: 1, pt: 1}}>
        <Grid item>
          <TextField
            label="New step name"
            value={state.stepToAdd}
            onChange={handleChange('stepToAdd')}
          />
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary" disabled={!state.stepToAdd} onClick={() => {

            // Mutate form and form.formStructure
            setForm(form => ({
              ...form,
              formStructure: [
                ...form.formStructure,
                {
                  stepName: state.stepToAdd,
                  fields: []
                }
              ]
            }));

          }}>
            Add Step
          </Button>
        </Grid>
      </Grid>
    )
  }, [state.stepToAdd, formType, handleChange]);

  const getNewFieldComponent = useCallback(() => {
    if (!formType) return null;
    return (
      <Grid container alignItems="center" spacing={2}>
        <Grid item sm={3} xs={4}>
          <SelectField
            label="Choose step"
            value={state.selectedStep}
            onChange={handleChange('selectedStep')}
            options={form.formStructure.map(s => s.stepName)}
            noDefaultStyle
            formControlProps={{fullWidth: true}}
            noEmpty
            controlled
          />
        </Grid>
        <Grid item sm={9} xs={10}>
          <Picker
            label={"characteristic"}
            onChange={setSelectedCharacteristicId}
            options={characteristicOptions}
            usedOptionKeys={usedCharacteristicIds}
            onAdd={handleAddCharacteristic}
            disabledAdd={!selectedCharacteristicId || !state.selectedStep}
          />
          <Picker
            label={"question"}
            onChange={setSelectedQuestionId}
            options={questionOptions}
            usedOptionKeys={usedQuestionIds}
            onAdd={handleAddQuestion}
            disabledAdd={!selectedQuestionId || !state.selectedStep}
          />
        </Grid>
      </Grid>
    )
  }, [state.fields, formType, handleChange, handleAddCharacteristic, state.selectedField,
    state.selectedStep, characteristicOptions, form.formStructure, usedCharacteristicIds,
    questionOptions, usedQuestionIds, selectedCharacteristicId, selectedQuestionId]);

  const fieldsComponents = useMemo(() => {
    if (form.formStructure.length === 0) return null;

    return form.formStructure.map((step, index) => {
      console.log('fieldsComponents', step, index)
      const {stepName, fields} = step;
      return (
        <Box key={index} sx={{pt: 1}}>
          <Typography variant="h6" color="textSecondary">
            {stepName}
            <IconButton onClick={handleRemoveStep(index, stepName)} size="large">
              <Delete/>
            </IconButton>
          </Typography>
          <Droppable droppableId={index + ''}>
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <StepFields
                  stepIndex={index}
                  stepFields={fields}
                  handleDeleteField={handleDeleteField}
                  characteristics={characteristics}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Divider/>
        </Box>
      );
    });
  }, [form, handleDeleteField, handleRemoveStep]);

  if (loading)
    return <Loading/>

  return (
    <Container>
      <Typography variant="h5">
        Manage Fields
      </Typography>

      <Grid container alignItems="flex-end" spacing={2} sx={{pb: 1, pt: 1}}>
        <Grid item>
          <SelectField
            label="Form type"
            value={formType}
            onChange={(e) => history.push(`/settings/forms/${e.target.value}/new`)}
            options={allForms}
            noEmpty
          />
        </Grid>
        {method === 'new' ?
          <Grid item xs={6}>
            <TextField fullWidth label="New form name" onChange={e => form.name = e.target.value}/>
          </Grid>
          :
          <>
            <Grid item>
              <SelectField
                label="Choose form"
                value={state.selectedForm}
                onChange={() => setForm(availableForms.find(form => form.name === e.target.value))}
                options={availableForms.map(form => form.name)}
                // noEmpty
              />

            </Grid>
            <Grid item>
              <Button variant="outlined" color="primary"
                      onClick={() => setOpenAddFormDialog(true)}>
                Add form
              </Button>
            </Grid>
          </>
        }

      </Grid>

      <Divider sx={{pt: 1, mb: 1}}/>
      {newStepComponent}
      {getNewFieldComponent()}
      <Paper variant="outlined" sx={{mt: 2, p: 1, pl: 2}}>
        <DragDropContext onDragEnd={onDragEnd}>
          {fieldsComponents}
        </DragDropContext>
      </Paper>

      {formType &&
        <Button variant="outlined" color="primary" onClick={submit} sx={{mt: 2}}>
          Submit
        </Button>}

      <AddFormDialog
        open={openAddFormDialog}
        handleAdd={(name) => {
          setAvailableForms(forms => [...forms, {name, formType, formStructure: []}]);
          setState(state => ({...state, selectedForm: name}));
          setOpenAddFormDialog(false);
        }}
        handleClose={() => setOpenAddFormDialog(false)}
      />
    </Container>
  )
}
