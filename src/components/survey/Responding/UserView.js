import React from 'react'

import { Grid } from '@material-ui/core';

import { Paper, Typography } from '@material-ui/core';

import formService from '../../../apis/survey/formService';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import RadioGroup from '@material-ui/core/RadioGroup';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";


import auth from '../../../apis/survey/authService';

const useStyles = makeStyles((theme) => ({

}));



function UserView(props) {
  const classes = useStyles();
  const history = useHistory();
  const [userId, setUserId] = React.useState("")
  const [formData, setFormData] = React.useState({});
  const [responseData, setResponseData] = React.useState([])
  //console.log(responseData);

  const [optionValue, setOptionValue] = React.useState([])
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [loadingFormData, setLoadingFormData] = React.useState(true);


  const [questions, setQuestions] = React.useState([]);
  const [value, setValue] = React.useState('');
  const [location, setLocation] = React.useState('');
  const cookies = new Cookies();
  //console.log(value);
  const [visibleQuestions, setVisibleQuestions] = React.useState({});

  React.useEffect(() => {
    let initialVisibility = {};
    questions.forEach(q => initialVisibility[q.id] = true);
    setVisibleQuestions(initialVisibility);
  }, [questions]);

  const evaluateCondition = (condition, skipValue, response) => {
    if (condition === 'equals') return response === skipValue;
    if (condition === 'greaterThan') return parseFloat(response) > parseFloat(skipValue);
    if (condition === 'lessThan') return parseFloat(response) < parseFloat(skipValue);
    if (condition === 'greaterThanEqual') return parseFloat(response) >= parseFloat(skipValue);
    if (condition === 'lessThanEqual') return parseFloat(response) <= parseFloat(skipValue);
    return true; // default for unsupported conditions
  };

  const updateQuestionVisibility = (questionId, response) => {
    let newVisibility = { ...visibleQuestions };
    questions.forEach(q => {
      if (q.parentQuestionId === questionId) {
        newVisibility[q.id] = !evaluateCondition(q.skipCondition, q.skipValue, response);
      }
    });
    setVisibleQuestions(newVisibility);
  };
  React.useEffect(() => {

    console.log(cookies.get('user'));

    if (auth.isAuthenticated()) {
      var userr = auth.getCurrentUser();
      console.log(userr.id);
      setUserId(userr.id);
    } else {
      history.push("/login");
    }
  }, [])


  const handleLocationRequest = (index) => {
    // Logic to request and handle location
    // For example, using the Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Process the position data
        setLocation(position.coords.latitude + "," + position.coords.longitude);
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
  // Handle change for radio buttons (MCQ)
const handleRadioChange = (selectedOptionIndex, questionIndex) => {
  const questionId = questions[questionIndex].id;
  const optionText = questions[questionIndex].options[selectedOptionIndex].optionText;

  const newResponseData = [...responseData];
  const responseIndex = newResponseData.findIndex(res => res.questionId === questionId);

  if (responseIndex >= 0) {
      newResponseData[responseIndex] = { ...newResponseData[responseIndex], answer: optionText };
  } else {
      newResponseData.push({ questionId, answer: optionText });
  }

  setResponseData(newResponseData);
  updateQuestionVisibility(questionId, optionText);
};

// Handle change for checkboxes (MMCQ)
const handleMMCQChange = (optionText, questionIndex) => {
  const questionId = questions[questionIndex].id;
  let newResponseData = [...responseData];
  const responseIndex = newResponseData.findIndex(res => res.questionId === questionId);

  if (responseIndex >= 0) {
      let answers = newResponseData[responseIndex].answer.split(', ');
      if (answers.includes(optionText)) {
          answers = answers.filter(answer => answer !== optionText);
      } else {
          answers.push(optionText);
      }
      newResponseData[responseIndex].answer = answers.join(', ');
  } else {
      newResponseData.push({ questionId, answer: optionText });
  }

  setResponseData(newResponseData);
  updateQuestionVisibility(questionId, newResponseData[responseIndex]?.answer);
};

// Handle change for text inputs
const handleTextChange = (text, questionIndex) => {
  const questionId = questions[questionIndex].id;

  const newResponseData = [...responseData];
  const responseIndex = newResponseData.findIndex(res => res.questionId === questionId);

  if (responseIndex >= 0) {
      newResponseData[responseIndex] = { ...newResponseData[responseIndex], answer: text };
  } else {
      newResponseData.push({ questionId, answer: text });
  }

  setResponseData(newResponseData);
  updateQuestionVisibility(questionId, text);
};

// Handle change for Yes/No buttons
const handleYesNoChange = (value, questionIndex) => {
  const questionId = questions[questionIndex].id;

  const newResponseData = [...responseData];
  const responseIndex = newResponseData.findIndex(res => res.questionId === questionId);

  if (responseIndex >= 0) {
      newResponseData[responseIndex] = { ...newResponseData[responseIndex], answer: value };
  } else {
      newResponseData.push({ questionId, answer: value });
  }

  setResponseData(newResponseData);
  updateQuestionVisibility(questionId, value);
};


  const getQuestion = (formId) => {
    formService.getFormQuestions(formId)
      .then((result) => {
        console.log(result);
        if (result.error) {
          console.log(result.error);
        } else {
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
    // setLoadingFormData(false)
  }

  React.useEffect(() => {
    var formId = props.match.params.formId
    console.log(formId);

    formService.getForm(formId)
      .then((data) => {
        console.log(data);

        setFormData(data)
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
    getQuestion(formId);

  }, [props.match.params.formId]);

  function submitResponse() {
    var submissionData = {
      formId: formData.id,
      userId: userId,
      response: responseData,
      location: location
    }
    console.log(submissionData);
    formService.createFormInstance({ surveyId: parseInt(formData.id), userId, location }).then((data) => {
      console.log(data);
      formService.createFormResponses(responseData, data.id).then((datas) => {
        console.log(datas);
        setIsSubmitted(true)
      }
      ).catch((err) => {
        console.log(err);
      }
      )
    }).catch((err) => {
      console.log(err);
    })


    // formService.submitResponse(submissionData)
    //   .then((data2) => {
    //     setIsSubmitted(true)
    //     console.log(data2);
    //   },
    //     error => {
    //       const resMessage =
    //         (error.response &&
    //           error.response.data &&
    //           error.response.data.message) ||
    //         error.message ||
    //         error.toString();
    //       console.log(resMessage);
    //     }
    //   );

  }

  function reloadForAnotherResponse() {
    window.location.reload(true);
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div>
        <AppBar position="static" style={{ backgroundColor: 'teal' }}>
          <Toolbar>
            <IconButton edge="start" style={{ marginRight: '10px', marginBottom: '5px' }} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{}}>
              DBC Forms
            </Typography>
          </Toolbar>
        </AppBar>
        <br></br>

        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
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

            {!isSubmitted ? (
              <div>
                <Grid>

                  {questions.map((ques, i) => visibleQuestions[ques.id] && (
                    <div key={i} style={{ margin: '1rem 0rem' }}>
                      <Paper>
                        <div style={{ margin: '1rem 0rem', padding: '1rem 0rem' }}>
                          <div style={{ marginBottom: '1rem' }}>

                            <Typography style={{ textAlign: 'left', width: '80%', margin: 'auto' }} variant="subtitle1" >{i + 1}. {ques.questionText}</Typography>
                            {ques.questionImage !== "" && (
                              <img src={ques.questionImage} width="80%" height="auto" />
                            )}
                          </div>

                          {ques.questionType === 'MCQ' && (
                            <RadioGroup
                              aria-label="quiz"
                              name={`quiz-${ques.id}`}
                              value={responseData.find(res => res.questionId === ques.id)?.option ?? ''}
                              onChange={(e) => handleRadioChange(parseInt(e.target.value), i)}
                            >
                              {ques.options.map((op, j) => (
                                <FormControlLabel style={{ width: '80%', margin: 'auto' }} key={j} value={j} control={<Radio />} label={op.optionText} />
                              ))}
                            </RadioGroup>
                          )}
                          {ques.questionType === 'MMCQ' && (
                            <div>
                              {ques.options.map((op, j) => {
                                const isOptionSelected = responseData.find(res => res.questionId === ques.id)?.answer?.split(', ').includes(op.optionText) || false;
                                return (
                                  <FormControlLabel
                                    key={j}
                                    control={
                                      <Checkbox
                                        checked={isOptionSelected}
                                        onChange={() => handleMMCQChange(op.optionText, i)}
                                      />
                                    }
                                    label={op.optionText}
                                  />
                                );
                              })}
                            </div>
                          )}



                          {ques.questionType === 'TEXT' && (
                            <TextField
                              style={{ width: '80%', margin: 'auto' }}
                              label="Your Answer"
                              value={responseData.find((res) => res.questionId === ques.id)?.answer || ''}
                              onChange={(e) => handleTextChange(e.target.value, i)}
                            />
                          )}
                          {ques.questionType === 'NUM' && (
                            <TextField
                              type='number'
                              style={{ width: '80%', margin: 'auto' }}
                              label="Your Answer"
                              value={responseData.find((res) => res.questionId === ques.id)?.answer || ''}
                              onChange={(e) => handleTextChange(e.target.value, i)}
                            />
                          )}

                          {ques.questionType === 'YES_NO' && (
                            <div style={{ width: '80%', margin: 'auto', display: 'flex', justifyContent: 'space-around' }}>
                              <Button variant={responseData.find((res) => res.questionId === ques.id)?.answer === "Yes" ? "contained" : "outlined"} onClick={() => handleYesNoChange("Yes", i)}>Yes</Button>
                              <Button variant={responseData.find((res) => res.questionId === ques.id)?.answer === "No" ? "contained" : "outlined"} onClick={() => handleYesNoChange("No", i)}>No</Button>
                            </div>
                          )}
                          {ques.questionType === 'LOC' && (
                            <div style={{ width: '80%', margin: 'auto', display: 'flex', justifyContent: 'space-around' }}>
                              <Button
                                variant="outlined"
                                onClick={() => handleLocationRequest(i)}
                              >
                                Request Location
                              </Button>
                            </div>
                          )}
                        </div>
                      </Paper>
                    </div>
                  ))}

                </Grid>
                <Grid>
                  <br></br>
                  <div style={{ display: 'flex' }}>
                    <Button variant="contained" color="primary" onClick={submitResponse}>
                      Submit
                    </Button>
                  </div>
                  <br></br>

                  <br></br>

                </Grid>
              </div>
            ) :
              (
                <div>
                  <Typography variant="body1">Form submitted</Typography>
                  <Typography variant="body2">Thanks for submiting form</Typography>


                  <Button onClick={reloadForAnotherResponse}>Submit another response</Button>
                </div>
              )
            }
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default UserView;

const FormControlLabelWrapper = props => {
  const { radioButton, ...labelProps } = props;
  return (
    <FormControlLabel
      control={<Radio />}
      label={"Radio " + props.value + props.jIndex}
      {...labelProps}
    />
  );
};
