import React from 'react'
//import QuestionHeader from './QuestionHeader';
import { Grid } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Paper, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import CloseIcon from '@material-ui/icons/Close';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import AccordionActions from '@material-ui/core/AccordionActions';
import Divider from '@material-ui/core/Divider';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import ImageUplaodModel from './ImageUplaodModel';
import formService from '../../../apis/survey/formService';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';
import SIAQuestions from '../../../utils/SIAQuestions';
import { Alert } from 'antd';

function QuestionsTab(props) {

  const [questions, setQuestions] = React.useState([]);
  const [openUploadImagePop, setOpenUploadImagePop] = React.useState(false);
  const [imageContextData, setImageContextData] = React.useState({ question: null, option: null });
  const [formData, setFormData] = React.useState({});
  const [loadingFormData, setLoadingFormData] = React.useState(true);
  const [initialQuestions, setInitialQuestions] = React.useState([]);

  const getQuestion = () => {
    setLoadingFormData(true)
    formService.getFormQuestions(props.formData.id)
      .then((result) => {
        console.log(result);
        if (result.error) {
          console.log(result.error);
        } else {
          setInitialQuestions(result);
          setQuestions(result)
        }
      },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(resMessage);
        }
      );
    setLoadingFormData(false)
  }

  React.useEffect(() => {

    // console.log("bhens ki")
    // setLoadingFormData(false)
  }, [initialQuestions])

  React.useEffect(() => {

    getQuestion();



    if (props.formData.questions !== undefined) {
      console.log(props.formData.questions.length);
      if (props.formData.questions.length === 0) {
        setQuestions([{ questionText: "Question", options: [{ optionText: "Option 1" }], open: false, questionType: "TEXT", skipLogics: [] }]);
      } else {
        setQuestions(props.formData.questions)
      }
      setLoadingFormData(false)
    }
    setFormData(props.formData)
    // setLoadingFormData(false)
  }, [])

  function isEqual(obj1, obj2) {
    console.log("JSON.stringify(obj1): ", JSON.stringify(obj1));
    console.log("JSON.stringify(obj2): ", JSON.stringify(obj2));
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
  function saveQuestions() {
    console.log("auto saving questions initiated");
    console.log(formData);
    console.log(questions);
    console.log(initialQuestions);

    const modifiedQuestions = questions.filter((question, index) => {
      return !isEqual(question, initialQuestions[index]);
    });

    if (modifiedQuestions.length === 0) {
      console.log("No changes to save");
      return; // No changes to save
    }
    setLoadingFormData(true)

    console.log("Saving modified questions: ", modifiedQuestions);

    //checking if the first question has id -1 if it does that means it is just asking for location and we need to remove it
    //we also need to get the response of the location question and save it in the database


    if (modifiedQuestions[0].id === -1) {
      modifiedQuestions.shift();
    }

    formService.autoSave(modifiedQuestions, formData.id)
      .then((result) => {
        console.log(result);
        getQuestion();
        // setQuestions(result.questions)
      },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(resMessage);
        }
      );

  }

  function checkImageHereOrNotForQuestion(gg) {
    // console.log(gg);
    if ((gg === undefined) || (gg === "")) {
      return false;
    } else {
      return true;
    }
  }

  function checkImageHereOrNotForOption(gg) {
    // console.log(gg);
    if ((gg === undefined) || (gg === "")) {
      return false;
    } else {
      return true;
    }
  }

  function addMoreQuestionField() {
    expandCloseAll(); //I AM GOD

    setQuestions(questions => [...questions, { surveyId: props.formData.id, options: [], questionText: "Question", open: false, questionType: "TEXT",skipLogics: [] }]);
  }

  function copyQuestion(i) {
    let qs = [...questions];
    expandCloseAll();
    const myNewOptions = [];
    qs[i].options.forEach(opn => {
      if ((opn.optionImage !== undefined) || (opn.optionImage !== "")) {
        var opn1new = {
          optionText: opn.optionText,
          optionImage: opn.optionImage
        }
      } else {
        var opn1new = {
          optionText: opn.optionText
        }
      }
      myNewOptions.push(opn1new)
    });
    const qImage = qs[i].questionImage || "";
    var newQuestion = { questionText: qs[i].questionText, questionImage: qImage, options: myNewOptions, open: true }
    setQuestions(questions => [...questions, newQuestion]);
  }

  const handleImagePopupOpen = () => {
    setOpenUploadImagePop(true);
  };


  function uploadImage(i, j) {

    setImageContextData({
      question: i,
      option: j
    });
    handleImagePopupOpen();

  }

  function updateImageLink(link, context) {

    var optionsOfQuestion = [...questions];
    var i = context.question

    if (context.option == null) {
      optionsOfQuestion[i].questionImage = link;
    } else {
      var j = context.option
      optionsOfQuestion[i].options[j].optionImage = link;
    }
    setQuestions(optionsOfQuestion);
  }
  function AutocompleteQuestionInput({ index, value, handleQuestionValue }) {
    return (
      <Autocomplete
        freeSolo
        style={{ marginBottom: '18px', width: '80%' }}
        options={SIAQuestions.map((option) => option[0])}
        value={value}
        renderInput={(params) => (
          <TextField {...params} value={value} label="Type or choose a question" margin="normal" variant="outlined" fullWidth={true}
          />
        )}
        onChange={(event, newValue) => {
          handleQuestionValue(newValue, index);
        }}
      />
    );
  }

  const handleLocationRequest = (index) => {
    // Logic to request and handle location
    // For example, using the Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Process the position data
        console.log("Latitude: " + position.coords.latitude +
          "\nLongitude: " + position.coords.longitude);
        // You might want to update the answer of the question here
      }, (error) => {
        console.error("Error Code = " + error.code + " - " + error.message);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  function deleteQuestion(i) {
    setLoadingFormData(true)

    formService.deleteQuestion(i)
      .then((result) => {
        console.log(result);
        getQuestion();
        // setQuestions(result.questions)
      },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(resMessage);
        }
      );

    // let qs = [...questions];
    // if (questions.length > 1) {
    //   qs.splice(i, 1);
    // }
    // setQuestions(qs)
  }

  function handleOptionValue(text, i, j) {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[i].options[j].optionText = text;
    //newMembersEmail[i]= email;
    setQuestions(optionsOfQuestion);
  }
  function handleYesNoChange(value, i) {
    const updatedQuestions = questions.map((q, idx) =>
      idx === i ? { ...q, questionType: "YES_NO" } : q
    );
    setQuestions(updatedQuestions);
  }
  function handleQuestionValue(text, i) {

    const optionsOfQuestion = questions.map((q, idx) =>
      idx === i ? { ...q, questionText: text } : q
    );
    setQuestions(optionsOfQuestion);
    // console.log(text);
  }

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    var itemgg = [...questions];

    const itemF = reorder(
      itemgg,
      result.source.index,
      result.destination.index
    );

    setQuestions(itemF);
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  function showAsQuestion(i) {
    let qs = [...questions];
    qs[i].open = false;
    setQuestions(qs);
  }

  function addOption(i) {
    var optionsOfQuestion = [...questions];
    if (optionsOfQuestion[i].options.length < 5) {
      optionsOfQuestion[i].options.push({ optionText: "Option " + (optionsOfQuestion[i].options.length + 1) })
    } else {
      console.log("Max  5 options ");
    }
    //console.log(optionsOfQuestion);
    setQuestions(optionsOfQuestion)
  }
  function handleTextAnswerChange(text, i) {
    const updatedQuestions = questions.map((q, idx) =>
      idx === i ? { ...q, questionType: "TEXT" } : q
    );
    console.log(updatedQuestions);
    setQuestions(updatedQuestions);
  }
  function handleYesNoChange(value, i) {
    const updatedQuestions = questions.map((q, idx) =>
      idx === i ? { ...q, questionType: "YES_NO" } : q
    );
    setQuestions(updatedQuestions);
  }

  function removeOption(i, j) {
    var optionsOfQuestion = [...questions];
    if (optionsOfQuestion[i].options.length > 1) {
      optionsOfQuestion[i].options.splice(j, 1);
      setQuestions(optionsOfQuestion)
      console.log(i + "__" + j);
    }
  }

  function handleQuestionTypeChange(type, i) {
    const updatedQuestions = questions.map((q, idx) =>
      idx === i ? { ...q, questionType: type } : q
    );
    setQuestions(updatedQuestions);
  }
  function handleSkipLogicChange(attribute, value, questionIndex, logicIndex) {
    setQuestions(questions.map((q, idx) => {
      if (idx === questionIndex) {
        // Clone the current skipLogics array
        const updatedSkipLogics = [...q.skipLogics];
        // Update the specified skip logic's attribute
        updatedSkipLogics[logicIndex] = {
          ...updatedSkipLogics[logicIndex],
          [attribute]: value
        };
        // Return the updated question with the modified skipLogics array
        return { ...q, skipLogics: updatedSkipLogics };
      }
      return q;
    }));
  }
  
  function addSkipLogic(questionIndex) {
    setQuestions(questions.map((q, idx) => {
      if (idx === questionIndex) {
        // Define a default new skip logic object
        const newSkipLogic = {
          parentQuestionId: '',
          skipCondition: '',
          skipValue: ''
        };
        // Add the new skip logic object to the current skipLogics array
        const updatedSkipLogics = [...q.skipLogics, newSkipLogic];
        // Return the updated question with the new skip logic added
        return { ...q, skipLogics: updatedSkipLogics };
      }
      return q;
    }));
  }
  
  
  function removeSkipLogic(questionIndex, logicIndex) {
    setQuestions(questions.map((q, idx) => {
      if (idx === questionIndex) {
        // Filter out the skip logic at the specified index
        const updatedSkipLogics = q.skipLogics.filter((_, index) => index !== logicIndex);
        // Return the updated question with the skip logic removed
        return { ...q, skipLogics: updatedSkipLogics };
      }
      return q;
    }));
  }
  

  function expandCloseAll() {
    let qs = [...questions];
    for (let j = 0; j < qs.length; j++) {
      qs[j].open = false;
    }
    setQuestions(qs);
  }

  function handleExpand(i) {
    let qs = [...questions];
    for (let j = 0; j < qs.length; j++) {
      if (i === j) {
        qs[i].open = true;

      } else {
        qs[j].open = false;
      }
    }
    setQuestions(qs);
  }

  function questionsUI() {
    return questions.map((ques, i) => (
      <Draggable key={i} draggableId={i + 'id'} index={i}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div>
              <div style={{ marginBottom: "15px" }}>
                <div style={{ width: '100%', marginBottom: '-7px' }}>
                  <DragIndicatorIcon style={{ transform: "rotate(-90deg)", color: '#DAE0E2' }} fontSize="small" />
                </div>

                <Accordion onChange={() => { handleExpand(i) }} expanded={questions[i].open}>
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    elevation={1} style={{ width: '100%' }}
                  >
                    {!questions[i].open ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '3px', paddingTop: '15px', paddingBottom: '15px' }}>
                        {/* <TextField id="standard-basic" label=" " value="Question" InputProps={{ disableUnderline: true }} />  */}

                        <Typography variant="subtitle1" style={{ marginLeft: '0px' }}>{i + 1}.  {ques.questionText}</Typography>


                        {ques.questionImage !== "" ? (
                          <div>
                            <img src={ques.questionImage} width="400px" height="auto" /><br></br><br></br>
                          </div>
                        ) : ""}

                        {
                          ques.questionType === "MCQ" ?
                            <>
                              {ques.options.map((op, j) => (

                                <div key={j}>
                                  <div style={{ display: 'flex' }}>
                                    <FormControlLabel disabled control={<Radio style={{ marginRight: '3px', }} />} label={
                                      <Typography style={{ color: '#555555' }}>
                                        {ques.options[j].optionText}
                                      </Typography>
                                    } />
                                  </div>

                                  <div>
                                    {op.optionImage !== "" ? (
                                      <img src={op.optionImage} width="160px" height="auto" />
                                    ) : ""}
                                  </div>
                                </div>
                              ))}
                            </>
                            :
                            ques.questionType === "YES_NO" ?
                              <div>
                                <Button
                                  variant={ques.answer === "Yes" ? "contained" : "outlined"}
                                  onClick={() => handleYesNoChange("Yes", i)}
                                >
                                  Yes
                                </Button>
                                <Button
                                  variant={ques.answer === "No" ? "contained" : "outlined"}
                                  onClick={() => handleYesNoChange("No", i)}
                                >
                                  No
                                </Button>
                              </div>
                              :

                              <TextField
                                disabled
                                fullWidth
                                label="Answer"
                                value={ques.answer}
                                onChange={(e) => handleTextAnswerChange(e.target.value, i)}
                              />

                        }


                      </div>
                    ) : ""}
                  </AccordionSummary>

                  <AccordionDetails>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '15px', marginTop: '-15px' }}>
                      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                        <Typography style={{ marginTop: '20px' }}>{i + 1}.</Typography>

                        {/* <TextField
                          fullWidth={true}
                          placeholder="Question Text"
                          style={{ marginBottom: '18px' }}
                          rows={2}
                          rowsMax={20}
                          multiline={true}

                          value={ques.questionText}
                          variant="filled"
                          onChange={(e) => { handleQuestionValue(e.target.value, i) }}
                        /> */}
                        <AutocompleteQuestionInput
                          index={i}
                          value={ques.questionText}
                          handleQuestionValue={handleQuestionValue}
                        />

                        <IconButton aria-label="upload image" onClick={() => { uploadImage(i, null) }}>
                          <CropOriginalIcon />
                        </IconButton>
                      </div>

                      <div>
                        {
                          checkImageHereOrNotForQuestion(ques.questionImage) ? (
                            <div>
                              <div style={{ width: '150px', display: 'flex', alignItems: 'flex-start', paddingLeft: '20px' }}>
                                <img src={ques.questionImage} width="150px" height="auto" />
                                <IconButton style={{ marginLeft: '-15px', marginTop: '-15px', zIndex: 999, backgroundColor: 'lightgrey', color: 'grey' }}
                                  size="small"
                                  onClick={() => {
                                    updateImageLink("", { question: i, option: null })
                                  }}>
                                  <CloseIcon />
                                </IconButton>
                              </div>
                            </div>
                          ) : ""
                        }
                      </div>
                      {
                        ques.questionType === "LOC" ? <></> :

                          <Select
                            label="Question Type"
                            value={ques.questionType ? ques.questionType : "TEXT"}
                            onChange={(e) => handleQuestionTypeChange(e.target.value, i)}
                            style={{
                              alignSelf: "center",
                              marginBottom: "17px",
                              width: "20%"
                            }}
                          >
                            <MenuItem value="MCQ">Multi - Choice</MenuItem>
                            <MenuItem value="MMCQ">Multi - Select</MenuItem>
                            <MenuItem value="TEXT">Text</MenuItem>
                            <MenuItem value="YES_NO">Yes/No</MenuItem>
                            <MenuItem value="NUM">Number</MenuItem>
                          </Select>
                      }
                      <div style={{ width: '100%' }}>
                        {
                          ques.questionType === "MCQ" ?
                            <>

                              {ques.options.map((op, j) => (
                                <div key={j}>
                                  <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '-12.5px', justifyContent: 'space-between', paddingTop: '5px', paddingBottom: '5px' }}>
                                    <Radio disabled />
                                    <TextField
                                      fullWidth={true}
                                      placeholder="Option text"
                                      style={{ marginTop: '5px' }}
                                      value={ques.options[j].optionText}
                                      onChange={(e) => { handleOptionValue(e.target.value, i, j) }}
                                    />
                                    <IconButton aria-label="upload image" onClick={() => { uploadImage(i, j) }}>
                                      <CropOriginalIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={() => { removeOption(i, j) }}>
                                      <CloseIcon />
                                    </IconButton>
                                  </div>
                                  <div>
                                    {
                                      checkImageHereOrNotForOption(op.optionImage) ? (
                                        <div>
                                          <div style={{ width: '150px', display: 'flex', alignItems: 'flex-start', paddingLeft: '20px' }}>
                                            <img src={op.optionImage} width="90px" height="auto" />
                                            <IconButton style={{ marginLeft: '-15px', marginTop: '-15px', zIndex: 999, backgroundColor: 'lightgrey', color: 'grey' }}
                                              size="small"
                                              onClick={() => {
                                                updateImageLink("", { question: i, option: j })
                                              }}
                                            >
                                              <CloseIcon />
                                            </IconButton>
                                          </div>
                                          <br></br>
                                          <br></br>
                                        </div>
                                      ) : ""
                                    }
                                  </div>
                                </div>
                              ))}
                              {(
                                <div>
                                  <Button size="small" onClick={() => { addOption(i) }} style={{ textTransform: 'none', marginLeft: "-5px" }}>
                                    Add Option
                                  </Button>
                                </div>
                              )}
                            </>
                            : ques.questionType === "MMCQ" ?
                              <>

                                {ques.options.map((op, j) => (
                                  <div key={j}>
                                    <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '-12.5px', justifyContent: 'space-between', paddingTop: '5px', paddingBottom: '5px' }}>
                                      <Radio disabled />
                                      <TextField
                                        fullWidth={true}
                                        placeholder="Option text"
                                        style={{ marginTop: '5px' }}
                                        value={ques.options[j].optionText}
                                        onChange={(e) => { handleOptionValue(e.target.value, i, j) }}
                                      />
                                      <IconButton aria-label="upload image" onClick={() => { uploadImage(i, j) }}>
                                        <CropOriginalIcon />
                                      </IconButton>
                                      <IconButton aria-label="delete" onClick={() => { removeOption(i, j) }}>
                                        <CloseIcon />
                                      </IconButton>
                                    </div>
                                    <div>
                                      {
                                        checkImageHereOrNotForOption(op.optionImage) ? (
                                          <div>
                                            <div style={{ width: '150px', display: 'flex', alignItems: 'flex-start', paddingLeft: '20px' }}>
                                              <img src={op.optionImage} width="90px" height="auto" />
                                              <IconButton style={{ marginLeft: '-15px', marginTop: '-15px', zIndex: 999, backgroundColor: 'lightgrey', color: 'grey' }}
                                                size="small"
                                                onClick={() => {
                                                  updateImageLink("", { question: i, option: j })
                                                }}
                                              >
                                                <CloseIcon />
                                              </IconButton>
                                            </div>
                                            <br></br>
                                            <br></br>
                                          </div>
                                        ) : ""
                                      }
                                    </div>
                                  </div>
                                ))}
                                {(
                                  <div>
                                    <Button size="small" onClick={() => { addOption(i) }} style={{ textTransform: 'none', marginLeft: "-5px" }}>
                                      Add Option
                                    </Button>
                                  </div>
                                )}
                              </>
                              :
                              ques.questionType === "YES_NO" ?
                                <div>
                                  <Button
                                    variant={ques.answer === "Yes" ? "contained" : "outlined"}
                                    onClick={() => handleYesNoChange("Yes", i)}
                                  >
                                    Yes
                                  </Button>
                                  <Button
                                    variant={ques.answer === "No" ? "contained" : "outlined"}
                                    onClick={() => handleYesNoChange("No", i)}
                                  >
                                    No
                                  </Button>
                                </div>
                                : ques.questionType === "LOC" ?
                                  <div>
                                    <Button
                                      variant="outlined"
                                      onClick={() => handleLocationRequest(i)}
                                    >
                                      Request Location
                                    </Button>
                                  </div>
                                  :
                                  ques.questionType === "NUM" ?
                                    <TextField
                                      disabled
                                      fullWidth
                                      type='number'
                                      label="Answer"
                                      value={ques.answer}
                                      onChange={(e) => handleTextAnswerChange(e.target.value, i)}
                                    /> :
                                    <TextField
                                      disabled
                                      fullWidth
                                      label="Answer"
                                      value={ques.answer}
                                      onChange={(e) => handleTextAnswerChange(e.target.value, i)}
                                    />

                        }
                      </div>
                      <br></br>
                      <br></br>
                      <Typography variant="body2" style={{ color: 'grey' }}>You can add maximum 5 options. If you want to add more then change in settings. Multiple choice single option is availible</Typography>
                      {!isEqual(questions, initialQuestions) && ques.id !== -1 &&
                        (
                          <p style={{ color: 'red' }}>Only Saved Question will be shown. Please save before adding skip logic.</p>

                        )

                      }
                      <div style={{width: '100%'}}>
                        <Typography variant="subtitle1" style={{marginTop: '40px', marginBottom: '10px' }}>
                          Skip Logic
                        </Typography>

                        {ques.skipLogics.map((logic, logicIndex) => (
                          <Grid  alignItems="center" style={{width: '80%',marginBottom: 10}} key={logicIndex}>
                          <Grid xs={12} style={{ marginBottom: 10 }}>
                            <Select
                              style={{width: '100%'}}
                              value={logic.parentQuestionId}
                              renderValue={selected => {
                                if (selected === undefined || selected === '') {
                                  return <span style={{ color: 'grey' }}>Select Parent Question</span>;
                                }
                                return selected;
                              }}
                              onChange={(e) => handleSkipLogicChange('parentQuestionId', e.target.value, i, logicIndex)}
                              displayEmpty
                            >
                              <MenuItem value="" style={{color: 'GrayText'}}>Select None</MenuItem>
                              {initialQuestions
                                .filter((q, idx) => idx !== i && q.id !== -1)
                                .map((q, idx) => (
                                  <MenuItem key={idx} value={q.id}>{q.questionText}</MenuItem>
                                ))}
                            </Select>
                          </Grid>
                          <br />

                          <Grid xs={12}>
                            <Select
                              style={{width: '100%'}}
                              value={logic.skipCondition}
                              renderValue={selected => {
                                if (selected === undefined || selected === '') {
                                  return <span style={{ color: 'grey' }}>Select Categories</span>;
                                }
                                return selected;
                              }}
                              onChange={(e) => handleSkipLogicChange('skipCondition', e.target.value, i, logicIndex)}
                              displayEmpty
                            >
                              <MenuItem value="" style={{ color: 'GrayText' }}>Select None</MenuItem>
                              <MenuItem value="equals">Equals To</MenuItem>
                              <MenuItem value="notEquals">Not Equals</MenuItem>
                              <MenuItem value="greaterThan">Greater Than</MenuItem>
                              <MenuItem value="lessThan">Less Than</MenuItem>
                              <MenuItem value="greaterThanEqual">Greater Than Equal to</MenuItem>
                              <MenuItem value="lessThanEqual">Less Than Equal to</MenuItem>
                              {/* ... other conditions */}
                            </Select>
                          </Grid>
                          <br />

                          <Grid xs={12}>
                            <TextField
                              style={{width: '100%'}}
                              label="Skip Value"
                              value={logic.skipValue}
                              onChange={(e) => handleSkipLogicChange('skipValue', e.target.value, i, logicIndex)}
                              variant="outlined"
                            />
                          </Grid>

                            {/* Remove Logic Button */}
                            {ques.skipLogics.length > 1 && (
                              <Grid item xs={12}>
                                <Button onClick={() => removeSkipLogic(i, logicIndex)} style={{ marginTop: 10 }}>
                                  Remove Condition
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                        ))}
                        {
                          ques.skipLogics.length < 3 && (
                            <Button onClick={() => addSkipLogic(i)} style={{ marginTop: 10 }}>
                              Add Skip Logic
                            </Button>
                          )
                        }
                      </div>


                    </div>
                  </AccordionDetails>

                  <Divider />

                  <AccordionActions>
                    <IconButton aria-label="View" onClick={() => { showAsQuestion(i) }}>
                      <VisibilityIcon />
                    </IconButton>

                    <IconButton aria-label="Copy" onClick={() => { copyQuestion(i) }}>
                      <FilterNoneIcon />
                    </IconButton>
                    <Divider orientation="vertical" flexItem />
                    {questions.length > 1 && (
                      <IconButton aria-label="delete" onClick={() => { deleteQuestion(ques.id) }}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    )}

                    {/* <IconButton aria-label="Image">
                      <MoreVertIcon />
                    </IconButton> */}
                  </AccordionActions>
                </Accordion>
              </div>
            </div>
          </div>
        )}
      </Draggable>

    )
    )
  }




  return (
    <div style={{ marginTop: '15px', marginBottom: '7px', paddingBottom: "30px" }}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        {loadingFormData ? (<CircularProgress />) :

          <Grid item xs={12} sm={5} style={{ width: '100%' }}>

            <Grid style={{ borderTop: '10px solid teal', borderRadius: 10 }}>
              <div>
                <div>
                  <Paper elevation={2} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '15px', paddingTop: '20px', paddingBottom: '20px' }}>
                      <Typography variant="h4" style={{ fontFamily: 'sans-serif Roboto', marginBottom: "15px" }}>
                        {formData.name}
                      </Typography>
                      <Typography variant="subtitle1">{formData.description}</Typography>
                    </div>
                  </Paper>
                </div>
              </div>
            </Grid>

            <Grid style={{ paddingTop: '10px' }}>
              <div>
                <ImageUplaodModel handleImagePopOpen={openUploadImagePop} handleImagePopClose={() => { setOpenUploadImagePop(false) }} updateImageLink={updateImageLink} contextData={imageContextData} />

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {questionsUI()}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <div>
                  <Button
                    variant="contained"

                    onClick={addMoreQuestionField}
                    endIcon={<AddCircleIcon />}
                    style={{ margin: '5px' }}
                  >Add Question </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={saveQuestions}
                    style={{ margin: '15px' }}
                    endIcon={<SaveIcon />}
                  >Save Questions </Button>
                </div>
              </div>
            </Grid>
          </Grid>}
      </Grid>
    </div>
  );
}
export default QuestionsTab
