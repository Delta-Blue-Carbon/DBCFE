import React from 'react'

import { Grid } from '@material-ui/core';

import { Paper, Typography } from '@material-ui/core';

import formService from '../../../apis/survey/formService';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
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
  const cookies = new Cookies();
  //console.log(value);
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



  const handleRadioChange = (selectedOptionIndex, questionIndex) => {
    const questionId = questions[questionIndex].id;
    const optionId = questions[questionIndex].options[selectedOptionIndex].id;
    const optionText = questions[questionIndex].options[selectedOptionIndex].optionText;
    console.log("optionText",optionText)

    const newResponseData = [...responseData];
    const responseIndex = newResponseData.findIndex(res => res.questionId === questionId);

    if (responseIndex >= 0) {
      // Update existing response
      newResponseData[responseIndex] = { ...newResponseData[responseIndex], optionId, option: selectedOptionIndex, answer: optionText };
    } else {
      // Add new response
      newResponseData.push({ questionId, optionId, option: selectedOptionIndex, answer: optionText });
    }

    setResponseData(newResponseData);
    console.log(newResponseData);
    
  };
  const handleTextChange = (text, i) => {
    const questionId = questions[i].id;

    const newResponseData = responseData.map((res) =>
      res.questionId === questionId ? { ...res, answer: text } : res
    );

    // If the question doesn't have a response yet, add it
    if (!newResponseData.some((res) => res.questionId === questionId)) {
      newResponseData.push({ questionId, answer: text });
    }
    console.log(newResponseData);

    setResponseData(newResponseData);
  };



  const handleYesNoChange = (value, i) => {
    const questionId = questions[i].id;

    // Find the index of the existing response for this question, if it exists
    const index = responseData.findIndex((res) => res.questionId === questionId);

    // Update or add the response
    const newResponseData = [...responseData];
    if (index > -1) {
      newResponseData[index] = { ...newResponseData[index], answer: value };
    } else {
      newResponseData.push({ questionId, answer: value });
    }
    console.log(newResponseData);

    setResponseData(newResponseData);
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
      response: responseData
    }
    console.log(submissionData);
    formService.createFormInstance({surveyId:parseInt(formData.id),userId}).then((data)=>{
      console.log(data);
      formService.createFormResponses(responseData,data.id).then((datas)=>{
        console.log(datas);
        setIsSubmitted(true)
      }
      ).catch((err)=>{
        console.log(err);
      }
      )
    }).catch((err)=>{
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

                  {questions.map((ques, i) => (
                    <div key={i} style={{margin:'1rem 0rem'}}>
                      <Paper>
                        <div style={{margin:'1rem 0rem', padding:'1rem 0rem'}}>
                          <div style={{ marginBottom:'1rem' }}>

                          <Typography style={{textAlign:'left', width:'80%', margin:'auto'}}  variant="subtitle1" >{i + 1}. {ques.questionText}</Typography>
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
                                <FormControlLabel style={{width:'80%', margin:'auto'}} key={j} value={j} control={<Radio />} label={op.optionText} />
                              ))}
                            </RadioGroup>
                          )}

                          {ques.questionType === 'TEXT' && (
                            <TextField
                            style={{width:'80%', margin:'auto'}}
                              label="Your Answer"
                              value={responseData.find((res) => res.questionId === ques.id)?.answer || ''}
                              onChange={(e) => handleTextChange(e.target.value, i)}
                            />
                          )}

                          {ques.questionType === 'YES_NO' && (
                            <div style={{width:'80%', margin:'auto', display:'flex', justifyContent: 'space-around'}}>
                              <Button variant={responseData.find((res) => res.questionId === ques.id)?.answer === "Yes" ? "contained" : "outlined"} onClick={() => handleYesNoChange("Yes", i)}>Yes</Button>
                              <Button variant={responseData.find((res) => res.questionId === ques.id)?.answer === "No" ? "contained" : "outlined"} onClick={() => handleYesNoChange("No", i)}>No</Button>
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
