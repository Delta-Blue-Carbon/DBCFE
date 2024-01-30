import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box  } from '@material-ui/core';
import * as XLSX from 'xlsx';
import { Bar, Pie } from 'react-chartjs-2';
import formService from '../../../apis/survey/formService';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    tableLayout: 'fixed',
  },
  cell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 150,
    alignItems: 'center',
  },
  chartContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    border: '1px solid #ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  chartTitle: {
    marginBottom: 10,
  }
});

function ResponseTab(props) {
  const classes = useStyles();
  const [formData, setFormData] = useState({});
  const [responseData, setResponseData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const toggleStats = () => {
    setShowStats(!showStats);
  };
  const getQuestion = () => {
    formService.getFormQuestions(props.formData.id)
      .then((result) => {
        if (result.error) {
          console.log(result.error);
        } else {
          result.shift();
          setQuestions(result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getQuestion();
    if (props.formData) {
      setFormData(props.formData);
    }
    var formId = props.formId;
    if (formId !== undefined && formId !== "") {
      formService.getFormResponses(formId)
        .then((data) => {
          setResponseData(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.formId, props.formData]);

  const getSelectedOption = (qId, j) => {
    var oneResData = responseData[j];
    var selectedOp = oneResData.responses.filter(qss => qss.questionId === qId);

    if (selectedOp.length > 0) {
      if (selectedOp[0].answer) {
        return selectedOp[0].answer;
      } else {
        var finalOption = questions.find(ques => ques.id === qId).options.find(oo => oo.id === selectedOp[0].optionId);
        return finalOption?.optionText || "Not Attempted";
      }
    } else {
      return "Not Attempted";
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(responseData.map((response) => {
      // Initialize the formatted response with user and survey instance details
      let formattedResponse = {
        User: response.userId,
        SurveyInstance: response.surveyInstanceId,
        CreatedAt: response.createdAt
      };
  
      // Process each response item to map question text to the corresponding answer
      response.responses.forEach((resp) => {
        // Find the question text using the questionId
        const questionText = questions.find(q => q.id === resp.questionId)?.questionText || "Unknown Question";
  
        // Add the question-answer pair to the formatted response
        formattedResponse[questionText] = resp.answer;
      });
  
      return formattedResponse;
    }));
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Responses");
    XLSX.writeFile(wb, "SurveyResponses.xlsx");
  };
  

  const generateChartData = (question) => {
    let chartData = { labels: [], datasets: [] };
  
    if (question.questionType === 'NUM') {
      // Pie Chart
      chartData.datasets.push({
        label: question.questionText,
        data: [],
        backgroundColor: [],
      });
  
      responseData.forEach(response => {
        const answer = response.responses.find(r => r.questionId === question.id)?.answer;
        if (answer) {
          const index = chartData.labels.indexOf(answer);
          if (index === -1) {
            chartData.labels.push(answer);
            chartData.datasets[0].data.push(1);
            chartData.datasets[0].backgroundColor.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
          } else {
            chartData.datasets[0].data[index] += 1;
          }
        }
      });
    } else if (question.questionType === 'YES_NO' || question.questionType === 'MCQ' || question.questionType === 'MMCQ') {
      // Bar Chart
      chartData.datasets.push({
        label: question.questionText,
        data: [],
        backgroundColor: [],
      });
  
      question.options.forEach((option) => {
        chartData.labels.push(option.optionText);
        let count = responseData.filter(response => {
          const answer = response.responses.find(r => r.questionId === question.id)?.answer;
          return answer === option.optionText;
        }).length;
        chartData.datasets[0].data.push(count);
        chartData.datasets[0].backgroundColor.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
      });
    } else if (question.questionType === 'TEXT') {
      // Count of responses
      chartData.labels.push('Responses');
      chartData.datasets.push({
        label: question.questionText,
        data: [responseData.filter(response => {
          const answer = response.responses.find(r => r.questionId === question.id)?.answer;
          return answer !== undefined && answer !== null && answer !== '';
        }).length],
        backgroundColor: ['rgba(54, 162, 235, 0.2)'],
      });
    }
  
    return chartData;
  };
  
  

  const renderChart = (question) => {
    let chartType = question.questionType;
    let chartData = generateChartData(question);
  
    switch (chartType) {
      case 'NUM':
        return <Pie data={chartData} />;
      case 'YES_NO':
      case 'MCQ':
      case 'MMCQ':
        return <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />;
      case 'TEXT':
        return <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />;
      default:
        return null;
    }
  };
  

  return (
    <div>
      <p>Responses</p>
      <Button onClick={exportToExcel}>Export to Excel</Button>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.cell} style={{ fontWeight: "bold" }}>User</TableCell>
              {questions.map((ques, i) => (
                <TableCell className={classes.cell} key={i} align="center" style={{ fontWeight: "bold" }}>
                  {ques.questionText}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {responseData.map((rs, j) => (
              <TableRow key={j}>
                <TableCell className={classes.cell} component="th" scope="row">
                  {rs.userId}
                </TableCell>
                {questions.map((ques, i) => (
                  <TableCell className={classes.cell} key={i} align="center">
                    {getSelectedOption(ques.id, j)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={toggleStats}>
        {showStats ? 'Hide Stats' : 'Generate Stats'}
      </Button>
      { showStats && questions.map((question, i) => (
        <Box key={i} className={classes.chartContainer}>
          <Typography variant="h6" className={classes.chartTitle}>
            {question.questionText}
          </Typography>
          {renderChart(question)}
        </Box>
      ))}
    </div>
  );
}

export default ResponseTab;
