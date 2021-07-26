import { React, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ReplaceBox from './ReplaceBox';
import { Button, Card, CardActions, CardContent } from '@material-ui/core';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App() {
  const [importedReplacements, setImportedReplacements] = useState("");
  const [replacedText, setReplacedText] = useState("");
  const [replacements, setReplacements] = useState([{ find: "a", replace: "a" }]);
  const [clipSuccess, setClipSuccess] = useState(false);
  const [clipFailure, setClipFailure] = useState(false);



  function handlePaste(event) {
    let rawText = (event.clipboardData || window.clipboardData).getData('text');
    console.log(replacements);
    for (let replacement of replacements) {
      const regExp = new RegExp(replacement.find, 'g');
      rawText = rawText.replaceAll(regExp, replacement.replace)
      console.log("replacing", regExp, replacement.replace, rawText)
    }
    console.log("Final text", rawText)
    setReplacedText(rawText);
    navigator.clipboard.writeText(rawText).then(openClipSuccessSnack, openClipFailureSnack)
  }

  function addReplacement() {
    if (replacements) {
      setReplacements([...replacements, { find: "a", replace: "a" }])
    } else {
      setReplacements([{ find: "a", replace: "a" }])
    }
  }

  function importReplacements() {
    const importedConfig = JSON.parse(importedReplacements);
    setReplacements(importedConfig);
  }

  function exportReplacements() {
    console.log(JSON.stringify(replacements));
  }

  function makeChangeCallback(idx) {
    const callback = function changeCallback(replacement) {
      let tempReplacements = replacements;
      tempReplacements[idx] = replacement;
      setReplacements(tempReplacements)
    }
    return callback;
  }

  function openClipSuccessSnack(event, reason) {
    setClipSuccess(true)
  }

  function closeClipSuccessSnack(event, reason) {
    setClipSuccess(false)
  }

  function openClipFailureSnack(event, reason) {
    setClipFailure(true)
  }

  function closeClipFailureSnack(event, reason) {
    setClipFailure(false)
  }

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={4}
        style={{ margin: "0px", maxWidth: "100%" }}
      >
        <Grid item xs={7}>
          <Grid
            container
            direction="column"
            spacing={4}
          >
            <Grid item>
              <Card>
                <TextField
                  label="Paste Text Here"
                  multiline
                  rows={20}
                  variant="outlined"
                  onPaste={handlePaste}
                  fullWidth
                />
              </Card>
            </Grid>
            <Grid item>
              <Card>
                <TextField
                  label="Modified Text"
                  multiline
                  rows={20}
                  variant="outlined"
                  onPaste={handlePaste}
                  fullWidth
                  disabled
                  value={replacedText}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Card>
                <CardContent>
                  <TextField
                    multiline
                    variant="outlined"
                    fullWidth
                    placeholder="Put config JSON here."
                    value={importedReplacements}
                    onChange={(event) => setImportedReplacements(event.target.value)}
                  />
                </CardContent>
                <CardActions>
                  <Button onClick={addReplacement}>Add Replacement</Button>
                  <Button onClick={importReplacements}>Import Config</Button>
                  <Button onClick={exportReplacements}>Export Config</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item>
              <Grid container spacing={2} direction="column">
                {replacements ?
                  replacements.map((replacement, idx) => <ReplaceBox key={idx} config={replacement} changeCallback={makeChangeCallback(idx)}></ReplaceBox>)
                  : "No replacements"}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar open={clipSuccess} autoHideDuration={3000} onClose={closeClipSuccessSnack}>
        <Alert onClose={closeClipSuccessSnack} severity="success">
          Processed and copied to clipboard!
        </Alert>
      </Snackbar>
      <Snackbar open={clipFailure} autoHideDuration={3000} onClose={closeClipFailureSnack}>
        <Alert onClose={closeClipFailureSnack} severity="error">
          Processed and copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
