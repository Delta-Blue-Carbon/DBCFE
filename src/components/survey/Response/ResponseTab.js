import React from 'react'
import formService from '../../../apis/survey/formService';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';



const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function ResponseTab(props) {
  const classes = useStyles();

  const [formData, setFormData] = React.useState({});
  const [responseData, setResponseData] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);
  
  const getQuestion = () => {
    // setLoadingFormData(true)
    formService.getFormQuestions(props.formData.id)
      .then((result) => {
        console.log(result);
        if (result.error) {
          console.log(result.error);
        } else {
          // setInitialQuestions(result);
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
      getQuestion();
      if(props.formData){
        // setQuestions(props.formData.questions)

        setFormData(props.formData)
      }
      var formId = props.formId
      if(formId !== undefined && formId !== ""){
        formService.getFormResponses(formId)
        .then((data) => { 
           console.log(data);     
            setResponseData(data)
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
    },[props.formId, props.formData]);


    function getSelectedOption(qId, i, j){
      var oneResData = responseData[j];
      //console.log(oneResData);
      
      var selectedOp = oneResData.responses.filter(qss => qss.questionId === qId);
     console.log("selectedOp",selectedOp);

      if(selectedOp.length > 0){
        // console.log("selectedOp[0].answer",selectedOp[0].answer);
        if (selectedOp[0].answer) {
          // console.log("so does it do here", selectedOp[0].answer)
          return selectedOp[0].answer
        } else {
          var finalOption = questions[i].options.find(oo => oo.id === selectedOp[0].optionId);
          console.log("finalOption",finalOption);
          return finalOption?.optionText
          
        }

      } else{
        return "Not Attempted"
      }

      
      // return selectedOp[0].optionId;
      //this.students.filter(stud => stud.Class==className);
    }

    // function getOptionTextById(optionId, questionId, i){
    // var finalOption = questions[i].options.find(oo => oo.id === optionId);
    // return finalOption.optionText
    // }


  
  return (
       <div>
          <p> Responses</p>
          <div>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{whiteSpace: 'nowrap'}}>User</TableCell>
                    {questions.map((ques, i)=>(
                      <TableCell style={{whiteSpace: 'nowrap'}} key={i} align="right">{ques.questionText}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody >
                {/* <TableRow>
                      <TableCell component="th" scope="row">
                        aanounfdv
                      </TableCell>
                      <TableCell align="right">2</TableCell>
                      <TableCell align="right">no</TableCell>
                      <TableCell align="right">yes</TableCell>
                     
                    </TableRow> */}
                  {responseData.map((rs, j) => (
                    <TableRow key={j}>
                      <TableCell component="th" scope="row">
                        {rs.userId}
                      </TableCell>
                      {questions.map((ques, i)=>(
                      <TableCell key={i} align="center">{getSelectedOption(ques.id, i,j)}</TableCell>
                    ))}
                      
                    </TableRow>
                  ))}
                </TableBody>
                
              </Table>
            </TableContainer>
          </div>



       </div>
  );
}
export default ResponseTab


var trash = `
<TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.calories}</TableCell>
                      <TableCell align="right">{row.fat}</TableCell>
                      <TableCell align="right">{row.carbs}</TableCell>
                      <TableCell align="right">{row.protein}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>`