import { React, useState } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import ReplaceBox from './ReplaceBox';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  Switch,
  Snackbar,
  TextField,
  Grid
} from '@material-ui/core';
import {
  createTheme,
  ThemeProvider
} from '@material-ui/core/styles';
import TurndownService from 'turndown';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App() {
  const theme = createTheme(
    {
      palette: {
        type: 'dark'
      }
    }
  )

  const [importedReplacements, setImportedReplacements] = useState();
  const [replacedText, setReplacedText] = useState("");
  const [replacements, setReplacements] = useState();
  const [clipSuccess, setClipSuccess] = useState(false);
  const [clipFailure, setClipFailure] = useState(false);

  const [htmlToMarkdown, setHtmlToMarkdown] = useState(false);

  const turndownService = new TurndownService(
    {
      headingStyle: "atx",
      hr: "---",
      bulletListMarker: "-",
      codeBlockStyle: "fenced"
    }
  )

  // [{"find":"(\\*\\*Melee\\*\\*)","replace":"$1\n"}]
  // [{"find":"(\\*\\*Melee\\*\\*)","replace":"$1\n"},{"find":"(\\*\\*Melee\\*\\*)","replace":"$1\n"}]

  function handlePaste(event) {
    let rawText = (event.clipboardData || window.clipboardData).getData('text');
    if (htmlToMarkdown) {
      rawText = (event.clipboardData || window.clipboardData).getData('text/html');
      rawText = turndownService.turndown(rawText);
    }
    for (let replacement of replacements) {
      const regExp = new RegExp(replacement.find, 'g');
      // May cause side efects??
      const newLineFixedReplace = replacement.replace.replaceAll("\\n", "\n");
      rawText = rawText.replaceAll(regExp, newLineFixedReplace);
    }
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
    <ThemeProvider theme={theme}>
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
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={htmlToMarkdown}
                        onChange={(event) => setHtmlToMarkdown(event.target.checked)}
                        color="primary"
                      />
                    }
                    label="Convert HTML To Markdown on Paste (before replacement)"
                  />
                </CardContent>
              </Card>
            </Grid>
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
                    onChange={(event) => setImportedReplacements(event.target.value)
                    }
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
    </ThemeProvider>
  );
}

export default App;
